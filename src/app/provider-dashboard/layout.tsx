"use client";

import RoleGate from "@/components/RoleGate";
import WorkspaceShell from "@/components/WorkspaceShell";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allowed={["provider", "admin"]}>
      <WorkspaceShell role="provider">{children}</WorkspaceShell>
    </RoleGate>
  );
}