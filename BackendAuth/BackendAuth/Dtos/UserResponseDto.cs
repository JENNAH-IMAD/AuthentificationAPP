namespace BackendAuth.Dtos;

/// <summary>
/// DTO pour la réponse d'un utilisateur
/// </summary>
public class UserResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<string> Roles { get; set; } = new List<string>();
}

/// <summary>
/// DTO pour la réponse de connexion
/// </summary>
public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserResponseDto User { get; set; } = new UserResponseDto();
    public DateTime ExpiresAt { get; set; }
} 