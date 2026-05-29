import Footer from "@/app/Layout/Footer";
import Sidebar from "@/app/Layout/Sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#FAF4EA] bg-[radial-gradient(circle_at_top_left,#f3dfc4_0,#f8f3ea_38%,#fffaf3_100%)] text-[#24150f]">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-72">
        {children}
        <Footer />
      </div>
    </div>
  );
}
