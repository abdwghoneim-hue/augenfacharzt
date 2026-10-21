import Link from "next/link";
import Image from "next/image";
import type { UserModel as User } from "@/generated/prisma/models";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";

const USER_LINKS = [
  { href: "/", label: "Übersicht" },
  { href: "/lernen", label: "Lernmodus" },
  { href: "/pruefung", label: "Prüfungssimulation" },
  { href: "/bildfragen", label: "Bildfragen" },
  { href: "/wiederholungen", label: "Meine Wiederholungen" },
  { href: "/fortschritt", label: "Lernfortschritt" },
];

const ADMIN_LINKS = [
  { href: "/admin/fragen", label: "Fragenverwaltung" },
  { href: "/admin/import", label: "Dokumente hochladen" },
  { href: "/admin/freigabe", label: "Inhaltsfreigabe" },
  { href: "/admin/benutzer", label: "Benutzerverwaltung" },
  { href: "/admin/fachgebiete", label: "Fachgebiete" },
];

export function Nav({ user }: { user: User }) {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/branding/daog-eye-mark.jpg" alt="" width={32} height={20} className="rounded" />
          <span className="text-sm font-semibold text-foreground">AugenFacharzt</span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {USER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/80 hover:text-accent">
              {link.label}
            </Link>
          ))}
          {user.role === "ADMIN" && (
            <>
              <span className="text-border">|</span>
              {ADMIN_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-accent/80 hover:text-accent">
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/konto" className="text-sm text-muted hover:text-accent">
            {user.username}
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="secondary" size="sm">
              Abmelden
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
