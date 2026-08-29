import { notFound } from "next/navigation";
import { LabClient } from "@/components/labs/LabClient";
import { getLabById, getAllLabs } from "@/lib/labData";

export function generateStaticParams() {
  return getAllLabs().map((lab) => ({ id: lab.id }));
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lab = getLabById(id);
  if (!lab) {
    notFound();
  }
  return <LabClient lab={lab} />;
}
