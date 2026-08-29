import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT Support Engineer Lab — Train Like an IT Support Engineer I",
  description:
    "Hands-on practice for the day-to-day work of supporting warehouse operations: Windows Server, Active Directory, networking, incident response, and operational excellence.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-y-auto">
      {children}
    </div>
  );
}
