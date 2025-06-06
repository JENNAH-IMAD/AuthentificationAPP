"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { userApi } from '@/lib/api';
import { User, CreateUserDto, UpdateUserDto } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Loader2, Plus, Users, Crown, UserCheck, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserDto>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleIds: [3], // Employé par défaut
    isActive: true,
  });
  
  const [editUser, setEditUser] = useState<UpdateUserDto>({});

  // Vérifier les permissions
  const isAdmin = currentUser?.roles.includes('Admin') ?? false;

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Accès non autorisé', {
        description: 'Vous devez être administrateur pour accéder à cette page.',
      });
      return;
    }
    
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
    setIsLoading(true);
    setError(null);
      
      console.log('Récupération des utilisateurs...');
      
      const response = await userApi.getUsers();
      
      console.log('Réponse API getUsers:', response);
      
      if (response.success && response.data) {
        console.log('Utilisateurs récupérés:', response.data);
        setUsers(response.data);
      } else {
        console.error('Erreur dans la réponse:', response);
        setError(response.message || 'Erreur lors de la récupération des utilisateurs');
      }
    } catch (error: any) {
      console.error('Erreur dans fetchUsers:', error);
      setError(error.message || 'Erreur de connexion');
      toast.error('Erreur', {
        description: 'Impossible de récupérer les utilisateurs',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error('Validation', {
        description: 'Veuillez remplir tous les champs obligatoires',
      });
      return;
    }

    if (!newUser.roleIds || newUser.roleIds.length === 0) {
      toast.error('Validation', {
        description: 'Veuillez sélectionner au moins un rôle pour l\'utilisateur',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log('Création utilisateur avec données:', {
        ...newUser,
        password: '[MASQUÉ]'
      });
      
      const response = await userApi.createUser(newUser);
      
      console.log('Réponse API:', response);
      
      if (response.success) {
        toast.success('Utilisateur créé', {
          description: `${newUser.username} a été créé avec succès`,
        });
        setIsAddDialogOpen(false);
        setNewUser({
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          roleIds: [3], // Employé par défaut
          isActive: true,
        });
        fetchUsers();
      } else {
        console.error('Erreur de création:', response);
        toast.error('Erreur', {
          description: response.message || 'Erreur lors de la création',
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur', {
        description: error.message || 'Erreur lors de la création',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    if (editUser.roleIds && editUser.roleIds.length === 0) {
      toast.error('Validation', {
        description: 'Veuillez sélectionner au moins un rôle pour l\'utilisateur',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log('Modification utilisateur avec données:', editUser);
      
      const response = await userApi.updateUser(selectedUser.id, editUser);
      
      console.log('Réponse API modification:', response);
      
      if (response.success) {
        toast.success('Utilisateur modifié', {
          description: `${selectedUser.username} a été modifié avec succès`,
        });
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        setEditUser({});
        fetchUsers();
      } else {
        console.error('Erreur de modification:', response);
        toast.error('Erreur', {
          description: response.message || 'Erreur lors de la modification',
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la modification:', error);
      toast.error('Erreur', {
        description: error.message || 'Erreur lors de la modification',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    // Empêcher la suppression de l'admin principal
    if (selectedUser.id === 1) {
      toast.error('Action interdite', {
        description: 'Impossible de supprimer l\'administrateur principal',
      });
      return;
    }

    // Empêcher l'auto-suppression
    if (selectedUser.id === currentUser?.id) {
      toast.error('Action interdite', {
        description: 'Vous ne pouvez pas supprimer votre propre compte',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await userApi.deleteUser(selectedUser.id);
      
      if (response.success) {
        toast.success('Utilisateur supprimé', {
          description: `${selectedUser.username} a été supprimé avec succès`,
        });
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error('Erreur', {
          description: response.message || 'Erreur lors de la suppression',
        });
      }
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message || 'Erreur lors de la suppression',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (user: User) => {
    console.log('Ouverture du modal de modification pour:', user);
    
    const roleIds = getRoleIds(user.roles);
    console.log('Conversion des rôles:', { originalRoles: user.roles, convertedRoleIds: roleIds });
    
    setSelectedUser(user);
    const editData = {
      username: user.username,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      isActive: user.isActive,
      roleIds: roleIds,
    };
    
    console.log('Données initiales du modal de modification:', editData);
    setEditUser(editData);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const getRoleIds = (roles: string[]): number[] => {
    return roles.map(role => {
      switch (role) {
        case 'Admin': return 1;
        case 'Manager': return 2;
        case 'Employé': return 3;
        default: return 3;
      }
    });
  };

  const getRoleIcon = (roles: string[]) => {
    if (roles.includes('Admin')) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (roles.includes('Manager')) return <UserCheck className="h-4 w-4 text-blue-500" />;
    return <UserIcon className="h-4 w-4 text-gray-500" />;
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Accès non autorisé</CardTitle>
            <CardDescription>
              Vous devez être administrateur pour accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement des utilisateurs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchUsers} className="w-full">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({users.length})</CardTitle>
          <CardDescription>
            Liste de tous les comptes utilisateurs du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.roles)}
                        <span className="font-medium">{user.username}</span>
                        {user.id === 1 && (
                          <Badge variant="secondary" className="text-xs">
                            Principal
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                      <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant={role === 'Admin' ? 'default' : 'secondary'}
                          >
                            {role === 'Employé' || role === 'EmployÃ©' ? 'Employé' : role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                      <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(user)}
                        >
                            <Edit className="h-4 w-4" />
                          </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(user)}
                          disabled={user.id === 1 || user.id === currentUser?.id}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Ajouter un utilisateur */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvel Utilisateur</DialogTitle>
            <DialogDescription>
              Créer un nouveau compte utilisateur
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Nom d'utilisateur *</Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="johndoe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Au moins 6 caractères"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Rôles</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin"
                    checked={newUser.roleIds.includes(1)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewUser({ ...newUser, roleIds: [...newUser.roleIds, 1] });
                      } else {
                        setNewUser({ ...newUser, roleIds: newUser.roleIds.filter(id => id !== 1) });
                      }
                    }}
                  />
                  <Label htmlFor="admin">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manager"
                    checked={newUser.roleIds.includes(2)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewUser({ ...newUser, roleIds: [...newUser.roleIds, 2] });
                      } else {
                        setNewUser({ ...newUser, roleIds: newUser.roleIds.filter(id => id !== 2) });
                      }
                    }}
                  />
                  <Label htmlFor="manager">Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="employee"
                    checked={newUser.roleIds.includes(3)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewUser({ ...newUser, roleIds: [...newUser.roleIds, 3] });
                      } else {
                        setNewUser({ ...newUser, roleIds: newUser.roleIds.filter(id => id !== 3) });
                      }
                    }}
                  />
                  <Label htmlFor="employee">Employé</Label>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={newUser.isActive}
                onCheckedChange={(checked) => setNewUser({ ...newUser, isActive: checked })}
              />
              <Label htmlFor="isActive">Compte actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateUser} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier un utilisateur */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier {selectedUser?.username}</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            {/* Nom d'utilisateur et Email */}
            <div className="grid gap-2">
              <Label htmlFor="editUsername">Nom d'utilisateur</Label>
              <Input
                id="editUsername"
                value={editUser.username || ''}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                placeholder="johndoe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={editUser.email || ''}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            
            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="editFirstName">Prénom</Label>
                <Input
                  id="editFirstName"
                  value={editUser.firstName || ''}
                  onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="editLastName">Nom</Label>
                <Input
                  id="editLastName"
                  value={editUser.lastName || ''}
                  onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Gestion des rôles */}
            <div className="grid gap-2">
              <Label>Rôles</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editAdmin"
                    checked={editUser.roleIds?.includes(1) || false}
                    onCheckedChange={(checked) => {
                      const currentRoles = editUser.roleIds || [];
                      let newRoles: number[];
                      
                      if (checked) {
                        newRoles = currentRoles.includes(1) ? currentRoles : [...currentRoles, 1];
                      } else {
                        newRoles = currentRoles.filter(id => id !== 1);
                      }
                      
                      console.log('Admin role changed:', { checked, currentRoles, newRoles });
                      setEditUser({ ...editUser, roleIds: newRoles });
                    }}
                  />
                  <Label htmlFor="editAdmin" className="text-sm">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editManager"
                    checked={editUser.roleIds?.includes(2) || false}
                    onCheckedChange={(checked) => {
                      const currentRoles = editUser.roleIds || [];
                      let newRoles: number[];
                      
                      if (checked) {
                        newRoles = currentRoles.includes(2) ? currentRoles : [...currentRoles, 2];
                      } else {
                        newRoles = currentRoles.filter(id => id !== 2);
                      }
                      
                      console.log('Manager role changed:', { checked, currentRoles, newRoles });
                      setEditUser({ ...editUser, roleIds: newRoles });
                    }}
                  />
                  <Label htmlFor="editManager" className="text-sm">Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editEmployee"
                    checked={editUser.roleIds?.includes(3) || false}
                    onCheckedChange={(checked) => {
                      const currentRoles = editUser.roleIds || [];
                      let newRoles: number[];
                      
                      if (checked) {
                        newRoles = currentRoles.includes(3) ? currentRoles : [...currentRoles, 3];
                      } else {
                        newRoles = currentRoles.filter(id => id !== 3);
                      }
                      
                      console.log('Employee role changed:', { checked, currentRoles, newRoles });
                      setEditUser({ ...editUser, roleIds: newRoles });
                    }}
                  />
                  <Label htmlFor="editEmployee" className="text-sm">Employé</Label>
                </div>
              </div>
            </div>

            {/* Statut du compte */}
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsActive"
                checked={editUser.isActive ?? true}
                onCheckedChange={(checked) => setEditUser({ ...editUser, isActive: checked })}
              />
              <Label htmlFor="editIsActive">Compte actif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateUser} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Supprimer un utilisateur */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer {selectedUser?.username}</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 