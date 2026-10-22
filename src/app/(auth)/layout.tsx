import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Subtle, slow-drifting color accents — decorative only, never covers content. */}
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-accent-light/10 blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="animate-fade-in-up mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src="/branding/daog-eye-mark.jpg"
            alt="Deutsch-Arabische Ophthalmologische Gesellschaft"
            width={72}
            height={46}
            className="rounded shadow-sm transition-transform duration-300 hover:scale-105"
          />
          <div>
            <Link href="/" className="text-xl font-semibold text-foreground">
              AugenFacharzt
            </Link>
            <p className="text-sm text-muted">Mündliche Prüfung – Lernplattform</p>
          </div>
        </div>
        <div className="animate-scale-in w-full max-w-md">{children}</div>
      </div>

      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}
