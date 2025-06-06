using BackendAuth.Dtos;
using BackendAuth.Models;

namespace BackendAuth.Services;

/// <summary>
/// Interface pour les services utilisateur
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Récupère tous les utilisateurs
    /// </summary>
    /// <returns>Liste des utilisateurs</returns>
    Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();

    /// <summary>
    /// Récupère un utilisateur par son ID
    /// </summary>
    /// <param name="id">ID de l'utilisateur</param>
    /// <returns>L'utilisateur ou null s'il n'existe pas</returns>
    Task<UserResponseDto?> GetUserByIdAsync(int id);

    /// <summary>
    /// Récupère un utilisateur par son nom d'utilisateur
    /// </summary>
    /// <param name="username">Nom d'utilisateur</param>
    /// <returns>L'utilisateur ou null s'il n'existe pas</returns>
    Task<User?> GetUserByUsernameAsync(string username);

    /// <summary>
    /// Récupère un utilisateur par son email
    /// </summary>
    /// <param name="email">Email de l'utilisateur</param>
    /// <returns>L'utilisateur ou null s'il n'existe pas</returns>
    Task<User?> GetUserByEmailAsync(string email);

    /// <summary>
    /// Crée un nouvel utilisateur
    /// </summary>
    /// <param name="createUserDto">Données de création de l'utilisateur</param>
    /// <returns>L'utilisateur créé</returns>
    Task<UserResponseDto> CreateUserAsync(CreateUserDto createUserDto);

    /// <summary>
    /// Met à jour un utilisateur
    /// </summary>
    /// <param name="id">ID de l'utilisateur</param>
    /// <param name="updateUserDto">Données de mise à jour</param>
    /// <returns>L'utilisateur mis à jour ou null s'il n'existe pas</returns>
    Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto);

    /// <summary>
    /// Supprime un utilisateur
    /// </summary>
    /// <param name="id">ID de l'utilisateur</param>
    /// <returns>True si supprimé avec succès, false sinon</returns>
    Task<bool> DeleteUserAsync(int id);

    /// <summary>
    /// Vérifie si un utilisateur existe par son nom d'utilisateur
    /// </summary>
    /// <param name="username">Nom d'utilisateur</param>
    /// <returns>True si l'utilisateur existe, false sinon</returns>
    Task<bool> UserExistsByUsernameAsync(string username);

    /// <summary>
    /// Vérifie si un utilisateur existe par son email
    /// </summary>
    /// <param name="email">Email</param>
    /// <returns>True si l'utilisateur existe, false sinon</returns>
    Task<bool> UserExistsByEmailAsync(string email);

    /// <summary>
    /// Récupère les rôles d'un utilisateur
    /// </summary>
    /// <param name="userId">ID de l'utilisateur</param>
    /// <returns>Liste des noms de rôles</returns>
    Task<IEnumerable<string>> GetUserRolesAsync(int userId);
} 