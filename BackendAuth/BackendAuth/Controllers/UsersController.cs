using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BackendAuth.Dtos;
using BackendAuth.Services;

namespace BackendAuth.Controllers;

/// <summary>
/// Contrôleur de gestion des utilisateurs
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Récupère tous les utilisateurs
    /// </summary>
    /// <returns>Liste de tous les utilisateurs</returns>
    /// <response code="200">Liste des utilisateurs récupérée avec succès</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="403">Accès interdit - rôle Admin requis</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();
            var usersList = users.ToList();
            
            _logger.LogInformation("Récupération de {Count} utilisateurs", usersList.Count);
            
            return Ok(new
            {
                success = true,
                message = "Utilisateurs récupérés avec succès",
                data = usersList,
                count = usersList.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des utilisateurs");
            return StatusCode(500, new
            {
                success = false,
                message = "Erreur interne du serveur",
                errors = new[] { ex.Message }
            });
        }
    }

    /// <summary>
    /// Récupère un utilisateur par son ID
    /// </summary>
    /// <param name="id">ID de l'utilisateur</param>
    /// <returns>Utilisateur correspondant à l'ID</returns>
    /// <response code="200">Utilisateur trouvé</response>
    /// <response code="404">Utilisateur non trouvé</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="403">Accès interdit - rôle Admin requis</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetUserById(int id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            
            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Utilisateur avec l'ID {id} non trouvé"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Utilisateur trouvé",
                data = user
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de l'utilisateur {UserId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = "Erreur interne du serveur",
                errors = new[] { ex.Message }
            });
        }
    }

    /// <summary>
    /// Crée un nouvel utilisateur
    /// </summary>
    /// <param name="createUserDto">Données de création de l'utilisateur</param>
    /// <returns>Utilisateur créé</returns>
    /// <response code="201">Utilisateur créé avec succès</response>
    /// <response code="400">Données invalides</response>
    /// <response code="409">Conflit - utilisateur existant</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="403">Accès interdit - rôle Admin requis</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Données de validation invalides",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToArray()
                });
            }

            var user = await _userService.CreateUserAsync(createUserDto);
            
            _logger.LogInformation("Utilisateur créé avec succès: {Username}", user.Username);
            
            return CreatedAtAction(
                nameof(GetUserById), 
                new { id = user.Id }, 
                new
                {
                    success = true,
                    message = "Utilisateur créé avec succès",
                    data = user
                }
            );
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Tentative de création d'un utilisateur existant: {Username}", createUserDto.Username);
            return Conflict(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création de l'utilisateur: {Username}", createUserDto.Username);
            return StatusCode(500, new
            {
                success = false,
                message = "Erreur interne du serveur",
                errors = new[] { ex.Message }
            });
        }
    }

    /// <summary>
    /// Met à jour un utilisateur
    /// </summary>
    /// <param name="id">ID de l'utilisateur</param>
    /// <param name="updateUserDto">Données de mise à jour</param>
    /// <returns>Utilisateur mis à jour</returns>
    /// <response code="200">Utilisateur mis à jour avec succès</response>
    /// <response code="404">Utilisateur non trouvé</response>
    /// <response code="400">Données invalides</response>
    /// <response code="409">Conflit - données existantes</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="403">Accès interdit - rôle Admin requis</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Données de validation invalides",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToArray()
                });
            }

            var user = await _userService.UpdateUserAsync(id, updateUserDto);
            
            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Utilisateur avec l'ID {id} non trouvé"
                });
            }

            _logger.LogInformation("Utilisateur mis à jour avec succès: {UserId}", id);
            return Ok(new
            {
                success = true,
                message = "Utilisateur mis à jour avec succès",
                data = user
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Tentative de mise à jour avec des données existantes pour l'utilisateur: {UserId}", id);
            return Conflict(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la mise à jour de l'utilisateur: {UserId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = "Erreur interne du serveur",
                errors = new[] { ex.Message }
            });
        }
    }

    /// <summary>
    /// Supprime un utilisateur
    /// </summary>
    /// <param name="id">ID de l'utilisateur</param>
    /// <returns>Confirmation de suppression</returns>
    /// <response code="200">Utilisateur supprimé avec succès</response>
    /// <response code="404">Utilisateur non trouvé</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="403">Accès interdit - rôle Admin requis</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var result = await _userService.DeleteUserAsync(id);
            
            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Utilisateur avec l'ID {id} non trouvé"
                });
            }

            _logger.LogInformation("Utilisateur supprimé avec succès: {UserId}", id);
            return Ok(new
            {
                success = true,
                message = "Utilisateur supprimé avec succès"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression de l'utilisateur: {UserId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = "Erreur interne du serveur",
                errors = new[] { ex.Message }
            });
        }
    }

    /// <summary>
    /// Récupère les rôles disponibles
    /// </summary>
    /// <returns>Liste des rôles disponibles</returns>
    /// <response code="200">Liste des rôles récupérée avec succès</response>
    [HttpGet("roles")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetAvailableRoles()
    {
        var roles = new[]
        {
            new { id = 1, name = "Admin" },
            new { id = 2, name = "Manager" },
            new { id = 3, name = "Employé" }
        };
        
        return Ok(new
        {
            success = true,
            message = "Rôles récupérés avec succès",
            data = roles
        });
    }
} 