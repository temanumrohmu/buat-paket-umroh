import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { packageInclude } from "@/lib/package-include";
import {
  toHotelCreateInput,
  toFlightCreateInput,
  toLineItemCreateInput,
  toTransportCreateInput,
  toGuideCreateInput,
  toHandlingCreateInput,
  type PackageData,
} from "@/lib/types";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/packages/[id]">) {
  const { id } = await ctx.params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: packageInclude,
  });

  if (!pkg) {
    return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(pkg);
}

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/packages/[id]">) {
  const { id } = await ctx.params;
  const body: PackageData = await request.json();

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: "Nama paket wajib diisi" }, { status: 400 });
  }

  const existing = await prisma.package.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });
  }

  const updated = await prisma.package.update({
    where: { id },
    data: {
      name: body.name,
      participants: body.participants || 1,
      departureDate: body.departureDate ? new Date(body.departureDate) : null,
      nightsMakkah: body.nightsMakkah || 0,
      nightsMadinah: body.nightsMadinah || 0,
      marginPercent: body.marginPercent || 0,
      exchangeRate: body.exchangeRate || 0,
      usdRate: body.usdRate || 0,
      notes: body.notes || "",
      hotels: {
        deleteMany: {},
        create: body.hotels?.map(toHotelCreateInput) ?? [],
      },
      flights: {
        deleteMany: {},
        create: body.flights?.map(toFlightCreateInput) ?? [],
      },
      documents: {
        deleteMany: {},
        create: body.documents?.map(toLineItemCreateInput) ?? [],
      },
      transports: {
        deleteMany: {},
        create: body.transports?.map(toTransportCreateInput) ?? [],
      },
      guides: {
        deleteMany: {},
        create: body.guides?.map(toGuideCreateInput) ?? [],
      },
      additionals: {
        deleteMany: {},
        create: body.additionals?.map(toLineItemCreateInput) ?? [],
      },
      handlings: {
        deleteMany: {},
        create: body.handlings?.map(toHandlingCreateInput) ?? [],
      },
    },
    include: packageInclude,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/packages/[id]">) {
  const { id } = await ctx.params;
  await prisma.package.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
