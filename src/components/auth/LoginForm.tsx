"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldGroup } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, null);

  return (
    <form action={formAction} className="space-y-1">
      {next && <input type="hidden" name="next" value={next} />}
      {state?.error && (
        <Alert tone="danger" className="mb-4">
          {state.error}
        </Alert>
      )}
      <FieldGroup>
        <Label htmlFor="username">Benutzername</Label>
        <Input id="username" name="username" autoComplete="username" required autoFocus />
      </FieldGroup>
      <FieldGroup>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Passwort</Label>
          <Link href="/passwort-vergessen" className="text-xs text-accent hover:underline">
            Passwort vergessen?
          </Link>
        </div>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Anmelden …" : "Anmelden"}
      </Button>
      <p className="mt-4 text-center text-sm text-muted">
        Noch kein Konto?{" "}
        <Link href="/register" className="text-accent hover:underline">
          Registrieren
        </Link>
      </p>
    </form>
  );
}
