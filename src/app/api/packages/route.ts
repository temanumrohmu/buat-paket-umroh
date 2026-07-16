import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripId, type PackageData } from "@/lib/types";

export async function GET() {
  const packages = await prisma.package.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, participants: true, updatedAt: true },
  });
  return NextResponse.json(packages);
}

export async function POST(request: NextRequest) {
  const body: PackageData = await request.json();

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: "Nama paket wajib diisi" }, { status: 400 });
  }

  const created = await prisma.package.create({
    data: {
      name: body.name,
      participants: body.participants || 1,
      marginPercent: body.marginPercent || 0,
      exchangeRate: body.exchangeRate || 0,
      notes: body.notes || "",
      hotels: { create: body.hotels?.map(stripId) ?? [] },
      flights: { create: body.flights?.map(stripId) ?? [] },
      documents: { create: body.documents?.map(stripId) ?? [] },
      transports: { create: body.transports?.map(stripId) ?? [] },
      guides: { create: body.guides?.map(stripId) ?? [] },
      additionals: { create: body.additionals?.map(stripId) ?? [] },
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

  return NextResponse.json(created, { status: 201 });
}
