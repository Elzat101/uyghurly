"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut, User, LogIn, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LucideIcon } from "lucide-react";

interface NavigationLink {
  href: string;
  label: string;
  icon?: LucideIcon;
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Admin emails that can access admin panel
  const ADMIN_EMAILS = ["parhat.elzat@gmail.com", "bouncebackuyghur@gmail.com"];
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const navigationLinks: NavigationLink[] = [
    { href: "/", label: "Home" },
    { href: "/lessons", label: "Lessons" },
    { href: "/dictionary", label: "Dictionary" },
    { href: "/profile", label: "Profile" },
    { href: "/settings", label: "Settings" },
    // Add admin link only for admin users
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          Uyghurly
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap flex items-center gap-1",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}

          {/* User Info and Logout/Login */}
          {isAuthenticated && (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {user?.isGuest
                    ? "Guest"
                    : user?.username ||
                      user?.email?.split("@")[0] ||
                      user?.name}
                </span>
              </div>
              {user?.isGuest ? (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Burger Menu */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Uyghurly
                </SheetTitle>
                {isAuthenticated && (
                  <div className="flex items-center gap-2 mt-2">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {user?.isGuest
                        ? "Guest"
                        : user?.username ||
                          user?.email?.split("@")[0] ||
                          user?.name}
                    </span>
                  </div>
                )}
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2",
                      pathname === link.href
                        ? "text-foreground bg-gray-50 dark:bg-gray-700"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.icon && <link.icon className="h-5 w-5" />}
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Logout/Login */}
                {isAuthenticated &&
                  (user?.isGuest ? (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 justify-start text-lg py-2 px-4 w-full rounded-md transition-colors"
                    >
                      <LogIn className="h-5 w-5" />
                      Log In
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 justify-start text-lg py-2 px-4"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
