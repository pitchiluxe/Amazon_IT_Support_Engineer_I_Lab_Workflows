import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { PageHeader } from "@/components/layout/PageHeader";
import { getAllLabs } from "@/lib/labData";

export default function DashboardPage() {
  const labs = getAllLabs();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your IT Support Engineer training hub — track progress, continue labs, and access tools."
      />
      <DashboardClient labs={labs} />
    </>
  );
}
