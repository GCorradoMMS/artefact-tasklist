"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLockup } from "./brand";
import { PlusIcon } from "./icons";
import { buttonPrimary } from "./ui";

/**
 * Persistent app header: brand lockup on the left, a "New task" CTA on the
 * right that only shows on the list route (it would compete with the form
 * submit button on create/edit and be noise on the error page).
 */
export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/60 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
        <BrandLockup />
        {pathname === "/" && (
          <Link href="/tasks/new" className={buttonPrimary}>
            <PlusIcon />
            New task
          </Link>
        )}
      </div>
    </header>
  );
}
