using System.ComponentModel.DataAnnotations;

namespace BackendAuth.Dtos;

/// <summary>
/// DTO pour les requêtes de connexion
/// </summary>
public class LoginRequestDto
{
    [Required(ErrorMessage = "L'email est requis")]
    [EmailAddress(ErrorMessage = "L'email n'est pas valide")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est requis")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Le mot de passe doit contenir entre 6 et 100 caractères")]
    public string Password { get; set; } = string.Empty;
} 