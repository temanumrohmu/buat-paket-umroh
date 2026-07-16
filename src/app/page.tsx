import PackageApp from "@/components/PackageApp";
import { prisma } from "@/lib/prisma";
import type { PackageSummaryListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getInitialList(): Promise<PackageSummaryListItem[]> {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, participants: true, updatedAt: true },
    });
    return packages.map((p) => ({ ...p, updatedAt: p.updatedAt.toISOString() }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const initialList = await getInitialList();
  return <PackageApp initialList={initialList} />;
}
