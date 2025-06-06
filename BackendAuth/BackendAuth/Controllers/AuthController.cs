using Microsoft.AspNetCore.Mvc;
using BackendAuth.Dtos;
using BackendAuth.Services;

namespace BackendAuth.Controllers;

/// <summary>
/// Contrôleur d'authentification
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Authentifie un utilisateur et retourne un token JWT
    /// </summary>
    /// <param name="loginRequest">Données de connexion</param>
    /// <returns>Token JWT et informations utilisateur</returns>
    /// <response code="200">Connexion réussie</response>
    /// <response code="400">Données de connexion invalides</response>
    /// <response code="401">Email ou mot de passe incorrect</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequest)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginRequest);

            if (result == null)
            {
                _logger.LogWarning("Tentative de connexion échouée pour l'utilisateur: {Email}", loginRequest.Email);
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });
            }

            _logger.LogInformation("Connexion réussie pour l'utilisateur: {Email}", loginRequest.Email);
            
            // Retourner la réponse dans le format attendu par le frontend
            return Ok(new
            {
                success = true,
                message = "Connexion réussie",
                data = new
                {
                    token = result.Token,
                    user = result.User,
                    expiresAt = result.ExpiresAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la connexion pour l'utilisateur: {Email}", loginRequest.Email);
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }

    /// <summary>
    /// Valide un token JWT
    /// </summary>
    /// <param name="request">Objet contenant le token à valider</param>
    /// <returns>Statut de validation du token</returns>
    /// <response code="200">Token valide</response>
    /// <response code="400">Token manquant</response>
    /// <response code="401">Token invalide</response>
    [HttpPost("validate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult ValidateToken([FromBody] TokenValidationRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest(new { message = "Token manquant" });
            }

            var isValid = _authService.ValidateToken(request.Token);

            if (!isValid)
            {
                return Unauthorized(new { isValid = false, message = "Token invalide" });
            }

            return Ok(new { isValid = true, message = "Token valide" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la validation du token");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }

    /// <summary>
    /// Endpoint pour tester l'API
    /// </summary>
    /// <returns>Message de test</returns>
    [HttpGet("test")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Test()
    {
        return Ok(new { message = "API BackendAuth fonctionne correctement!", timestamp = DateTime.UtcNow });
    }
}

/// <summary>
/// DTO pour la validation de token
/// </summary>
public class TokenValidationRequest
{
    public string Token { get; set; } = string.Empty;
} 