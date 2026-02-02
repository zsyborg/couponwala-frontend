"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Create structured data for schema.org BreadcrumbList
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://couponwala.com${item.href}` : undefined,
    })),
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Visual breadcrumb */}
      <nav className={`flex items-center gap-1 text-sm ${className}`}>
        {/* Home Link */}
        <Link
          href="/"
          className="flex items-center gap-1 text-gray-500 hover:text-orange-500 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* Separator and items */}
        {items.map((item, index) => (
          <span key={item.label} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-orange-500 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-[300px]">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

// Helper function to generate breadcrumb items for different pages
export function getBreadcrumbsForPage(pathname: string, params?: Record<string, string>): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  // Home is already handled by the component
  // Add page-specific breadcrumbs

  if (pathname === "/") {
    return items;
  }

  if (pathname.startsWith("/offers")) {
    if (params?.id) {
      items.push({ label: "Offers", href: "/offers" });
      items.push({ label: params.id });
    } else {
      items.push({ label: "Offers", href: "/offers" });
    }
    return items;
  }

  if (pathname === "/cart") {
    items.push({ label: "Cart" });
    return items;
  }

  if (pathname === "/checkout") {
    items.push({ label: "Cart", href: "/cart" });
    items.push({ label: "Checkout" });
    return items;
  }

  if (pathname.startsWith("/checkout/confirmation")) {
    items.push({ label: "Cart", href: "/cart" });
    items.push({ label: "Checkout", href: "/checkout" });
    items.push({ label: "Confirmation" });
    return items;
  }

  if (pathname === "/profile") {
    items.push({ label: "Profile" });
    return items;
  }

  if (pathname === "/notifications") {
    items.push({ label: "Notifications" });
    return items;
  }

  if (pathname === "/about") {
    items.push({ label: "About Us" });
    return items;
  }

  if (pathname === "/contact") {
    items.push({ label: "Contact Us" });
    return items;
  }

  return items;
}
