using System.ComponentModel.DataAnnotations;

namespace BackendAuth.Dtos;

/// <summary>
/// DTO pour la création d'un utilisateur
/// </summary>
public class CreateUserDto
{
    [Required(ErrorMessage = "Le nom d'utilisateur est requis")]
    [StringLength(50, ErrorMessage = "Le nom d'utilisateur ne peut pas dépasser 50 caractères")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "L'email est requis")]
    [StringLength(100, ErrorMessage = "L'email ne peut pas dépasser 100 caractères")]
    [EmailAddress(ErrorMessage = "Format d'email invalide")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est requis")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Le mot de passe doit contenir entre 6 et 100 caractères")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$",
        ErrorMessage = "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial")]
    public string Password { get; set; } = string.Empty;

    [StringLength(100, ErrorMessage = "Le prénom ne peut pas dépasser 100 caractères")]
    public string? FirstName { get; set; }

    [StringLength(100, ErrorMessage = "Le nom de famille ne peut pas dépasser 100 caractères")]
    public string? LastName { get; set; }

    // Support des deux formats pour la compatibilité
    public List<int>? RoleIds { get; set; } = new List<int>();
    
    public List<string>? Roles { get; set; } = new List<string>();

    public bool IsActive { get; set; } = true;
} 