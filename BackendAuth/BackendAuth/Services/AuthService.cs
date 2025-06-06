using BackendAuth.Dtos;
using BackendAuth.Security;
using Microsoft.Extensions.Options;

namespace BackendAuth.Services;

/// <summary>
/// Service d'authentification
/// </summary>
public class AuthService
{
    private readonly IUserService _userService;
    private readonly JwtService _jwtService;
    private readonly JwtSettings _jwtSettings;

    public AuthService(IUserService userService, JwtService jwtService, IOptions<JwtSettings> jwtSettings)
    {
        _userService = userService;
        _jwtService = jwtService;
        _jwtSettings = jwtSettings.Value;
    }

    /// <summary>
    /// Authentifie un utilisateur et retourne un token JWT
    /// </summary>
    /// <param name="loginRequest">Demande de connexion</param>
    /// <returns>Réponse de connexion avec token ou null si échec</returns>
    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto loginRequest)
    {
        // Récupérer l'utilisateur par email
        var user = await _userService.GetUserByEmailAsync(loginRequest.Email);
        
        if (user == null || !user.IsActive)
        {
            return null; // Utilisateur inexistant ou inactif
        }

        // Vérifier le mot de passe
        if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
        {
            return null; // Mot de passe incorrect
        }

        // Récupérer les rôles de l'utilisateur
        var roles = await _userService.GetUserRolesAsync(user.Id);

        // Générer le token JWT
        var token = _jwtService.GenerateToken(user, roles);

        // Créer la réponse
        var userResponse = new UserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Roles = roles.ToList()
        };

        return new LoginResponseDto
        {
            Token = token,
            User = userResponse,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes)
        };
    }

    /// <summary>
    /// Valide un token JWT
    /// </summary>
    /// <param name="token">Token à valider</param>
    /// <returns>True si le token est valide, false sinon</returns>
    public bool ValidateToken(string token)
    {
        return _jwtService.ValidateToken(token);
    }
} 