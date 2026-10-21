import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Image
          src="/branding/daog-eye-mark.jpg"
          alt="Deutsch-Arabische Ophthalmologische Gesellschaft"
          width={72}
          height={46}
          className="rounded"
        />
        <div>
          <Link href="/" className="text-xl font-semibold text-foreground">
            AugenFacharzt
          </Link>
          <p className="text-sm text-muted">Mündliche Prüfung – Lernplattform</p>
        </div>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
