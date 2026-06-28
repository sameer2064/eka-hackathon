"use client";

import RoleGate from "@/components/RoleGate";
import WorkspaceShell from "@/components/WorkspaceShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allowed={["admin"]} redirectTo="/admin-login">
      <WorkspaceShell role="admin">{children}</WorkspaceShell>
    </RoleGate>
  );
}