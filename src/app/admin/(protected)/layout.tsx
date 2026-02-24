import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Top bar */}
      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <img
            src="/lawnies_logo.svg"
            alt="Lawnies"
            className="h-7 w-auto"
            style={{
              filter:
                "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(110deg)",
            }}
          />
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
            Admin
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/admin/dashboard"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/settings/email"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Email Settings
          </Link>
          <Link
            href="/admin/settings/welcome"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Welcome Settings
          </Link>
          <Link
            href="/admin/settings/complete"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Complete Settings
          </Link>
          <SignOutButton />
        </nav>
      </header>

      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
