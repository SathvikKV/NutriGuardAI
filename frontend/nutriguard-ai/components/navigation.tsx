"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Logo from "@/components/logo";
import { logout } from "@/lib/auth";

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
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo />
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
          <button className="ml-2">
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
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
