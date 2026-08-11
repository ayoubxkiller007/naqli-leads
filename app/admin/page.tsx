import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/admin-auth";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  if (!(await isAdminRequest())) redirect("/admin/login");
  return <AdminDashboard />;
}
