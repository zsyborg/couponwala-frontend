"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, User, Menu, X, LogOut, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/hooks/useAuth";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { SearchModal } from "@/components/search/SearchModal";

export function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/offers", label: "Coupons" },
  ];

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  // Close mobile menu when navigating
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-orange-500 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">CouponWala</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive(link.href)
                    ? "text-black underline decoration-2 underline-offset-4"
                    : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative p-2 rounded-lg hover:bg-orange-100 hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-white" />
            </button>

            {/* Notifications Bell */}
            {isAuthenticated && <NotificationsDropdown />}

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg hover:bg-orange-100 hover:text-black transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {totalItems > 0 && (
                <Badge
                  variant="error"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <User className="h-5 w-5 text-white" />
                  <span className="hidden sm:block text-sm font-medium text-white">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-orange-50 shadow-lg">
                    <div className="p-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span className="text-sm">Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors text-orange-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/login">
                  <button className="px-4 py-2 text-sm font-medium text-white hover:text-black transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-orange-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-orange-600 bg-orange-100 font-medium"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
                onClick={handleNavClick}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-4 space-y-2">
                <Link href="/login" onClick={handleNavClick}>
                  <button className="w-full px-4 py-2 text-sm font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/signup" onClick={handleNavClick}>
                  <button className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
