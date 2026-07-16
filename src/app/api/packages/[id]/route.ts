import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripId, type PackageData } from "@/lib/types";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/packages/[id]">) {
  const { id } = await ctx.params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: {
      hotels: true,
      flights: true,
      documents: true,
      transports: true,
      guides: true,
      additionals: true,
    },
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
      marginPercent: body.marginPercent || 0,
      exchangeRate: body.exchangeRate || 0,
      notes: body.notes || "",
      hotels: {
        deleteMany: {},
        create: body.hotels?.map(stripId) ?? [],
      },
      flights: {
        deleteMany: {},
        create: body.flights?.map(stripId) ?? [],
      },
      documents: {
        deleteMany: {},
        create: body.documents?.map(stripId) ?? [],
      },
      transports: {
        deleteMany: {},
        create: body.transports?.map(stripId) ?? [],
      },
      guides: {
        deleteMany: {},
        create: body.guides?.map(stripId) ?? [],
      },
      additionals: {
        deleteMany: {},
        create: body.additionals?.map(stripId) ?? [],
      },
    },
    include: {
      hotels: true,
      flights: true,
      documents: true,
      transports: true,
      guides: true,
      additionals: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/packages/[id]">) {
  const { id } = await ctx.params;
  await prisma.package.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
