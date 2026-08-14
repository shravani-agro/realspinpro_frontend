import type { Metadata } from "next";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Admin Dashboard | RealSpinPro",
  description: "RealSpinPro admin control panel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutWrapper>
      {children}
      <Toaster theme="dark" richColors position="top-right" />
    </AdminLayoutWrapper>
  );
}
