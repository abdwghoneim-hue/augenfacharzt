import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-center text-xs text-muted sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <Image
            src="/branding/daog-eye-mark.jpg"
            alt=""
            width={20}
            height={13}
            className="rounded opacity-80"
          />
          <span>AugenFacharzt – Mündliche Prüfung</span>
        </div>
        <span>
          Entwickelt von <span className="font-medium text-foreground">Dr. Abdelhamid Ghunaim</span>
        </span>
      </div>
    </footer>
  );
}
