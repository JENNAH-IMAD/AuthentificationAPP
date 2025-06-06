'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre compte et vos préférences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Vos informations personnelles et détails du compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label className="text-sm font-medium">Nom d'utilisateur</Label>
              <p className="text-sm text-muted-foreground">{user?.username}</p>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <Label className="text-sm font-medium">Rôles</Label>
              <div className="flex flex-wrap items-center gap-2">
                {user?.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                  >
                    {role === 'Employé' || role === 'EmployÃ©' ? 'Employé' : role}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
            <CardDescription>
              Personnalisez votre expérience de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notifications Email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications email sur l'activité de votre compte.
                </p>
              </div>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor-auth">Authentification à Deux Facteurs</Label>
                <p className="text-sm text-muted-foreground">
                  Ajouter une couche de sécurité supplémentaire à votre compte.
                </p>
              </div>
              <Switch id="two-factor-auth" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 