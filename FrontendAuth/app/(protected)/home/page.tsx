'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart, PieChart, Clock, TrendingUp, DollarSign } from 'lucide-react';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !isMounted) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  // Déterminer le nom d'affichage
  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.username;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenue, {displayName} ! Voici un aperçu de votre tableau de bord.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rôle(s):</span>
            {user.roles.map((role, index) => (
              <span 
                key={role}
                className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
              >
                {role === 'Employé' || role === 'EmployÃ©' ? 'Employé' : role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[{
          title: 'Total Users',
          value: '24',
          change: '+12% par rapport au mois dernier',
          icon: <Users className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
        }, {
          title: 'Sessions Actives',
          value: '12',
          change: '+3% par rapport à la dernière heure',
          icon: <Clock className="h-6 w-6 text-green-500 dark:text-green-400" />,
        }, {
          title: 'Vues de Pages',
          value: '573',
          change: '+18% par rapport à hier',
          icon: <BarChart className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />,
        }, {
          title: 'Ventes (Exemple)',
          value: '45 231,89 €',
          change: '+20.1% par rapport au mois dernier',
          icon: <DollarSign className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
        }].map((stat, i) => (
          <Card
            key={stat.title}
            className="transition-shadow hover:shadow-2xl shadow-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold tracking-tight text-zinc-800 dark:text-white">{stat.title}</CardTitle>
              <div className="p-2 rounded-full bg-zinc-100 dark:bg-white/10">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-zinc-900 dark:text-white drop-shadow">{stat.value}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overview and Recent Activity Cards - Responsive Grid */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-zinc-800 dark:text-white">Activités Récentes</CardTitle>
            <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">Vos activités système les plus récentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 divide-y divide-zinc-200 dark:divide-zinc-800">
              {[
                { user: 'John Doe', action: 'Connexion réussie', time: 'il y a 2 minutes', color: 'bg-blue-100 dark:bg-blue-500' },
                { user: 'Jane Smith', action: 'Profil mis à jour', time: 'il y a 1 heure', color: 'bg-green-100 dark:bg-green-500' },
                { user: 'Bob Johnson', action: 'Nouvel utilisateur créé', time: 'il y a 3 heures', color: 'bg-yellow-100 dark:bg-yellow-500' },
                { user: 'Alice Brown', action: 'Mot de passe modifié', time: 'il y a 5 heures', color: 'bg-rose-100 dark:bg-rose-500' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center">
                    <div className={`mr-4 flex h-11 w-11 items-center justify-center rounded-full ${activity.color} bg-opacity-80 dark:bg-opacity-20 p-2 shadow-inner`}>
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-zinc-800 dark:text-white">{activity.user}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 shadow-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-zinc-800 dark:text-white">Aperçu des Rôles</CardTitle>
            <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">Résumé des rôles utilisateur et permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: 'Admin', color: 'bg-blue-500', desc: 'Peut accéder à toutes les fonctionnalités y compris la gestion des utilisateurs', access: 'Accès Complet', badge: 'text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-500/20' },
                { name: 'Manager', color: 'bg-green-500', desc: 'Peut accéder à la plupart des fonctionnalités sauf la gestion des utilisateurs', access: 'Accès Limité', badge: 'text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-500/20' },
                { name: 'Employé', color: 'bg-yellow-500', desc: 'Peut seulement voir le tableau de bord et les informations de base', access: 'Accès de Base', badge: 'text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-500/20' },
              ].map((role, i) => (
                <div key={role.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-block h-3 w-3 rounded-full ${role.color}`}></span>
                      <span className="text-base font-semibold text-zinc-800 dark:text-white">{role.name}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${role.badge}`}>{role.access}</span>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 ml-6">{role.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}