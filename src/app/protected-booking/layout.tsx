"use client";

import RoleGate from "@/components/RoleGate";
import WorkspaceShell from "@/components/WorkspaceShell";

export default function ProtectedBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allowed={["customer", "admin"]}>
      <WorkspaceShell role="customer">{children}</WorkspaceShell>
    </RoleGate>
  );
}