import { AppShellServer } from "@/components/app/AppShellServer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShellServer>{children}</AppShellServer>;
}

