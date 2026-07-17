import PackageApp from "@/components/PackageApp";
import { prisma } from "@/lib/prisma";
import { packageInclude } from "@/lib/package-include";
import type { PackageData } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getInitialList(): Promise<PackageData[]> {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { updatedAt: "desc" },
      include: packageInclude,
    });
    return JSON.parse(JSON.stringify(packages));
  } catch {
    return [];
  }
}

export default async function Home() {
  const initialList = await getInitialList();
  return <PackageApp initialList={initialList} />;
}
