using Microsoft.EntityFrameworkCore;
using BackendAuth.Data;
using BackendAuth.Dtos;
using BackendAuth.Models;

namespace BackendAuth.Services;

/// <summary>
/// Service de gestion des utilisateurs
/// </summary>
public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .ToListAsync();

        return users.Select(MapToUserResponseDto);
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id);

        return user != null ? MapToUserResponseDto(user) : null;
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<UserResponseDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        // Vérifier si l'utilisateur existe déjà
        if (await UserExistsByUsernameAsync(createUserDto.Username))
        {
            throw new InvalidOperationException("Un utilisateur avec ce nom d'utilisateur existe déjà");
        }

        if (await UserExistsByEmailAsync(createUserDto.Email))
        {
            throw new InvalidOperationException("Un utilisateur avec cet email existe déjà");
        }

        // Créer l'utilisateur
        var user = new User
        {
            Username = createUserDto.Username,
            Email = createUserDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
            FirstName = createUserDto.FirstName ?? string.Empty,
            LastName = createUserDto.LastName ?? string.Empty,
            IsActive = createUserDto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Assigner les rôles - Support des deux formats
        await AssignRolesAsync(user.Id, createUserDto);

        // Retourner l'utilisateur créé avec ses rôles
        return await GetUserByIdAsync(user.Id) ?? throw new InvalidOperationException("Erreur lors de la création de l'utilisateur");
    }

    public async Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return null;

        // Mettre à jour les propriétés si elles sont fournies
        if (!string.IsNullOrEmpty(updateUserDto.Username))
        {
            if (await UserExistsByUsernameAsync(updateUserDto.Username) && user.Username != updateUserDto.Username)
            {
                throw new InvalidOperationException("Un utilisateur avec ce nom d'utilisateur existe déjà");
            }
            user.Username = updateUserDto.Username;
        }

        if (!string.IsNullOrEmpty(updateUserDto.Email))
        {
            if (await UserExistsByEmailAsync(updateUserDto.Email) && user.Email != updateUserDto.Email)
            {
                throw new InvalidOperationException("Un utilisateur avec cet email existe déjà");
            }
            user.Email = updateUserDto.Email;
        }

        if (!string.IsNullOrEmpty(updateUserDto.FirstName))
            user.FirstName = updateUserDto.FirstName;

        if (!string.IsNullOrEmpty(updateUserDto.LastName))
            user.LastName = updateUserDto.LastName;

        if (updateUserDto.IsActive.HasValue)
            user.IsActive = updateUserDto.IsActive.Value;

        user.UpdatedAt = DateTime.UtcNow;

        // Mettre à jour les rôles si fournis
        if (updateUserDto.RoleIds != null)
        {
            // Supprimer les anciens rôles
            var existingUserRoles = await _context.UserRoles
                .Where(ur => ur.UserId == id)
                .ToListAsync();
            _context.UserRoles.RemoveRange(existingUserRoles);
            
            // Sauvegarder la suppression des anciens rôles
            await _context.SaveChangesAsync();

            // Assigner les nouveaux rôles (qui seront sauvegardés automatiquement)
            await AssignRoleIdsByUserAsync(id, updateUserDto.RoleIds);
        }
        else
        {
            // Sauvegarder seulement si pas de mise à jour des rôles
            await _context.SaveChangesAsync();
        }

        return await GetUserByIdAsync(id);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return false;

        // Supprimer les rôles associés
        var userRoles = await _context.UserRoles
            .Where(ur => ur.UserId == id)
            .ToListAsync();
        _context.UserRoles.RemoveRange(userRoles);

        // Supprimer l'utilisateur
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UserExistsByUsernameAsync(string username)
    {
        return await _context.Users.AnyAsync(u => u.Username == username);
    }

    public async Task<bool> UserExistsByEmailAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<string>> GetUserRolesAsync(int userId)
    {
        return await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Include(ur => ur.Role)
            .Select(ur => ur.Role.Name)
            .ToListAsync();
    }

    // Nouvelle méthode pour assigner les rôles avec support des deux formats
    private async Task AssignRolesAsync(int userId, CreateUserDto createUserDto)
    {
        Console.WriteLine($"🔧 AssignRolesAsync - UserId: {userId}");
        Console.WriteLine($"🔧 CreateUserDto.RoleIds: [{string.Join(", ", createUserDto.RoleIds ?? new List<int>())}]");
        Console.WriteLine($"🔧 CreateUserDto.Roles: [{string.Join(", ", createUserDto.Roles ?? new List<string>())}]");
        
        List<int> roleIdsToAssign = new List<int>();

        // Priorité 1: Utiliser RoleIds si fourni et non vide
        if (createUserDto.RoleIds != null && createUserDto.RoleIds.Any())
        {
            roleIdsToAssign = createUserDto.RoleIds.ToList();
            Console.WriteLine($"✅ Utilisation de RoleIds: [{string.Join(", ", roleIdsToAssign)}]");
        }
        // Priorité 2: Convertir Roles (noms) en IDs si fourni et non vide
        else if (createUserDto.Roles != null && createUserDto.Roles.Any())
        {
            Console.WriteLine($"🔄 Conversion des noms de rôles: [{string.Join(", ", createUserDto.Roles)}]");
            
            foreach (var roleName in createUserDto.Roles)
            {
                var roleId = roleName switch
                {
                    "Admin" => 1,
                    "Manager" => 2,
                    "Employé" => 3,
                    "Employee" => 3, // Support pour "Employee" en anglais
                    _ => 3 // Par défaut, Employé
                };
                
                Console.WriteLine($"🔄 '{roleName}' → ID {roleId}");
                
                if (!roleIdsToAssign.Contains(roleId))
                {
                    roleIdsToAssign.Add(roleId);
                }
            }
        }
        // Par défaut: Assigner le rôle Employé
        else
        {
            roleIdsToAssign.Add(3);
            Console.WriteLine($"⚠️ Aucun rôle fourni, assignation par défaut: Employé (ID 3)");
        }

        Console.WriteLine($"🎯 RoleIds finaux à assigner: [{string.Join(", ", roleIdsToAssign)}]");

        // Assigner les rôles
        await AssignRoleIdsByUserAsync(userId, roleIdsToAssign);
    }

    // Nouvelle méthode pour assigner les rôles par IDs
    private async Task AssignRoleIdsByUserAsync(int userId, IEnumerable<int> roleIds)
    {
        Console.WriteLine($"💾 AssignRoleIdsByUserAsync - UserId: {userId}, RoleIds: [{string.Join(", ", roleIds)}]");
        
        int assignedCount = 0;
        
        foreach (var roleId in roleIds)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == roleId);
            if (role != null)
            {
                Console.WriteLine($"✅ Rôle trouvé: {role.Name} (ID: {role.Id})");
                
                var userRole = new UserRole
                {
                    UserId = userId,
                    RoleId = role.Id,
                    AssignedAt = DateTime.UtcNow
                };
                _context.UserRoles.Add(userRole);
                assignedCount++;
                
                Console.WriteLine($"➕ UserRole ajouté au contexte: UserId={userId}, RoleId={role.Id}");
            }
            else
            {
                Console.WriteLine($"❌ Rôle non trouvé pour ID: {roleId}");
            }
        }
        
        Console.WriteLine($"💾 Sauvegarde de {assignedCount} rôle(s) en base de données...");
        
        // IMPORTANT: Sauvegarder les rôles en base de données
        var saveResult = await _context.SaveChangesAsync();
        
        Console.WriteLine($"✅ Sauvegarde terminée: {saveResult} enregistrement(s) affecté(s)");
    }

    private static UserResponseDto MapToUserResponseDto(User user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
        };
    }
} 