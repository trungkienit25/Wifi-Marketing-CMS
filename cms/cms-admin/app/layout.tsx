import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar"; // Import Sidebar vừa tạo
import "./globals.css";

export const metadata: Metadata = {
  title: "Super CMS - Hệ thống quản trị",
  description: "Quản lý hệ thống website đa dự án",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans" suppressHydrationWarning>
        
        {/* Nhúng thanh Sidebar thông minh vào đây */}
        <Sidebar />

        {/* Khu vực nội dung chính */}
        <main className="flex-1 h-full overflow-y-auto relative">
          {children}
        </main>

      </body>
    </html>
  );
}