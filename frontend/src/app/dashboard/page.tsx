import { LogoutButton } from "@/components/custom/LogoutButtons";

export default function DashboardRoute() {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <h1>Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
