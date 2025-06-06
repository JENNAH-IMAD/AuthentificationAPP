using System.ComponentModel.DataAnnotations;

namespace BackendAuth.Dtos;

/// <summary>
/// DTO pour la mise à jour d'un utilisateur
/// </summary>
public class UpdateUserDto
{
    [StringLength(50, ErrorMessage = "Le nom d'utilisateur ne peut pas dépasser 50 caractères")]
    public string? Username { get; set; }

    [StringLength(100, ErrorMessage = "L'email ne peut pas dépasser 100 caractères")]
    [EmailAddress(ErrorMessage = "Format d'email invalide")]
    public string? Email { get; set; }

    [StringLength(100, ErrorMessage = "Le prénom ne peut pas dépasser 100 caractères")]
    public string? FirstName { get; set; }

    [StringLength(100, ErrorMessage = "Le nom de famille ne peut pas dépasser 100 caractères")]
    public string? LastName { get; set; }

    public bool? IsActive { get; set; }

    public List<int>? RoleIds { get; set; }
} 