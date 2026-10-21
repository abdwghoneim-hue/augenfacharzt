import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/guards";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { UserStatusBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import {
  setUserStatusAction,
  setUserRoleAction,
  toggleRegistrationAction,
} from "@/app/actions/users";

export default async function UsersAdminPage() {
  const currentAdmin = await requireAdminUser();
  const [users, settings, pendingCount] = await Promise.all([
    prisma.user.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }] }),
    prisma.registrationSettings.findUnique({ where: { id: 1 } }),
    prisma.user.count({ where: { status: "PENDING" } }),
  ]);
  const registrationOpen = settings?.registrationOpen ?? true;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Benutzerverwaltung</h1>
        <p className="mt-1 text-sm text-muted">
          {pendingCount > 0
            ? `${pendingCount} Registrierung${pendingCount === 1 ? "" : "en"} warten auf Freischaltung.`
            : "Keine ausstehenden Registrierungen."}
        </p>
      </div>

      <Card className="flex items-center justify-between">
        <div>
          <CardTitle>Registrierung</CardTitle>
          <CardDescription>
            {registrationOpen
              ? "Neue Nutzer können sich derzeit registrieren."
              : "Die Registrierung ist derzeit geschlossen."}
          </CardDescription>
        </div>
        <form action={toggleRegistrationAction}>
          <input type="hidden" name="registrationOpen" value={(!registrationOpen).toString()} />
          <Button type="submit" variant="secondary">
            {registrationOpen ? "Registrierung schließen" : "Registrierung öffnen"}
          </Button>
        </form>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-gray-50 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Benutzer</th>
              <th className="px-4 py-3">Rolle</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Registriert am</th>
              <th className="px-4 py-3">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{user.username}</div>
                  <div className="text-xs text-muted">{user.email ?? "keine E-Mail"}</div>
                </td>
                <td className="px-4 py-3">
                  {user.id === currentAdmin.id ? (
                    <Badge tone="accent">Administrator (Sie)</Badge>
                  ) : (
                    <form action={setUserRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <Select name="role" defaultValue={user.role} className="w-auto">
                        <option value="USER">Nutzer</option>
                        <option value="ADMIN">Administrator</option>
                      </Select>
                      <Button type="submit" variant="ghost" size="sm">
                        ✓
                      </Button>
                    </form>
                  )}
                </td>
                <td className="px-4 py-3">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(user.createdAt).toLocaleDateString("de-DE")}
                </td>
                <td className="px-4 py-3">
                  {user.id === currentAdmin.id ? (
                    <span className="text-xs text-muted">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.status !== "APPROVED" && (
                        <form action={setUserStatusAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="status" value="APPROVED" />
                          <Button type="submit" size="sm">
                            Freischalten
                          </Button>
                        </form>
                      )}
                      {user.status === "PENDING" && (
                        <form action={setUserStatusAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="status" value="REJECTED" />
                          <Button type="submit" variant="secondary" size="sm">
                            Ablehnen
                          </Button>
                        </form>
                      )}
                      {user.status === "APPROVED" && (
                        <form action={setUserStatusAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="status" value="SUSPENDED" />
                          <Button type="submit" variant="danger" size="sm">
                            Sperren
                          </Button>
                        </form>
                      )}
                      {user.status === "SUSPENDED" && (
                        <form action={setUserStatusAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="status" value="APPROVED" />
                          <Button type="submit" variant="secondary" size="sm">
                            Entsperren
                          </Button>
                        </form>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
