"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
// import Logo from "@/components/logo"; // Assuming Logo exists or I should check. Navigation.tsx line 7 imports it.
import { supabase } from "@/lib/supabase";

const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Ingredients",
    href: "/ingredients",
  },
  {
    name: "Journal",
    href: "/meals",
  },
  {
    name: "AI Chat",
    href: "/chat",
  },
  {
    name: "Scan",
    href: "/scan",
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  // const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">NutriGuard AI</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
