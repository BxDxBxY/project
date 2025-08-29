"use client";
import React from "react";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
// import { TokenManager } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import MiniDrawer from "@/components/ui/Drawer";
import { TokenManager } from "@/lib/tokenManager";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  const handleLogout = () => {
    TokenManager.clearTokens();
    router.replace("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <MiniDrawer handleLogout={handleLogout}>{children}</MiniDrawer>
    </AdminAuthGuard>
  );
}

// <AdminAuthGuard>
//   <div className="min-h-screen flex bg-gray-100">
//     {/* Sidebar */}
//     <aside className="w-64 bg-white shadow-lg flex flex-col p-4">
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-blue-700">Admin Panel</h2>
//       </div>
//       <nav className="flex-1 space-y-2">
//         <Link
//           href="/admin/terms"
//           className="block px-4 py-2 rounded hover:bg-blue-50"
//         >
//           Terms
//         </Link>
//         <Link
//           href="/admin/categories"
//           className="block px-4 py-2 rounded hover:bg-blue-50"
//         >
//           Categories
//         </Link>
//         <Link
//           href="/admin/users"
//           className="block px-4 py-2 rounded hover:bg-blue-50"
//         >
//           Users
//         </Link>
//       </nav>
//     </aside>
//     {/* Main content */}
//     <div className="flex-1 flex flex-col">
//       {/* Topbar */}
//       <header className="flex items-center justify-end bg-white shadow px-6 py-4">
//         <div className="flex items-center space-x-4">
//           {/* User icon and logout/update actions will go here */}
//           <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
//             A
//           </div>
//           <button
//             className="text-sm text-blue-600 hover:underline"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//       </header>
//       <main className="flex-1 p-8 overflow-y-auto">{children}</main>
//     </div>
//   </div>
// </AdminAuthGuard>
