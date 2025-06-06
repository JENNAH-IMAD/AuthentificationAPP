using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAuth.Models;

/// <summary>
/// Modèle représentant un rôle
/// </summary>
[Table("Roles")]
public class Role
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(200)]
    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relations
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
} 