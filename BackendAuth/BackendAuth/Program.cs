using BackendAuth.Data;
using BackendAuth.Extensions;
using BackendAuth.Security;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuration des services
builder.Services.AddControllers();

// Configuration de la base de données PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("La chaîne de connexion 'DefaultConnection' est manquante.");
builder.Services.AddDatabase(connectionString);

// Configuration JWT
var jwtSettings = new JwtSettings();
builder.Configuration.GetSection(JwtSettings.SectionName).Bind(jwtSettings);
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));

// Configuration de l'authentification JWT
builder.Services.AddJwtAuthentication(jwtSettings);

// Configuration des services d'application
builder.Services.AddApplicationServices();

// Configuration Swagger avec JWT
builder.Services.AddSwaggerWithJwt();

// Configuration CORS
builder.Services.AddCorsPolicy();

// Configuration des commentaires XML pour Swagger
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = false;
});

var app = builder.Build();

// Configuration du pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "BackendAuth API V1");
        c.RoutePrefix = string.Empty; // Swagger à la racine
        c.DocumentTitle = "BackendAuth API";
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List);
    });
}

// Middleware de sécurité
// app.UseHttpsRedirection(); // Désactivé pour utiliser HTTP uniquement

// CORS
app.UseCors("AllowAll");

// Authentification et autorisation
app.UseAuthentication();
app.UseAuthorization();

// Contrôleurs
app.MapControllers();

// Migration automatique et seed en développement
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    try
    {
        // Appliquer les migrations automatiquement
        context.Database.Migrate();
        Console.WriteLine("✅ Base de données migrée avec succès");
        
        // Seed de l'utilisateur admin s'il n'existe pas
        await SeedAdminUserAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erreur lors de la migration de la base de données: {ex.Message}");
    }
}

// Méthode pour seeder l'utilisateur admin
static async Task SeedAdminUserAsync(ApplicationDbContext context)
{
    // Vérifier si l'utilisateur admin existe déjà
    var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "admin");
    
    if (adminUser == null)
    {
        // Créer l'utilisateur admin
        adminUser = new BackendAuth.Models.User
        {
            Username = "admin",
            Email = "admin@backend.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123*"),
            FirstName = "Admin",
            LastName = "System",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        
        context.Users.Add(adminUser);
        await context.SaveChangesAsync();
        
        // Assigner le rôle Admin
        var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
        if (adminRole != null)
        {
            var userRole = new BackendAuth.Models.UserRole
            {
                UserId = adminUser.Id,
                RoleId = adminRole.Id,
                AssignedAt = DateTime.UtcNow
            };
            
            context.UserRoles.Add(userRole);
            await context.SaveChangesAsync();
        }
        
        Console.WriteLine("✅ Utilisateur admin créé avec succès");
    }
    else
    {
        Console.WriteLine("ℹ️ Utilisateur admin déjà existant");
    }
}

// Message de démarrage et ouverture automatique de Swagger
app.Lifetime.ApplicationStarted.Register(() =>
{
    Console.WriteLine("🚀 BackendAuth API démarrée avec succès!");
    
    if (app.Environment.IsDevelopment())
    {
        // URL principale HTTP (simple et sans problème de certificat)
        var appUrl = "http://localhost:5232";
        
        Console.WriteLine($"📊 Swagger UI disponible sur: {appUrl}");
        Console.WriteLine("🌐 Ouverture automatique de Swagger UI...");
        
        // Ouvrir automatiquement Swagger dans le navigateur
        try
        {
            var psi = new System.Diagnostics.ProcessStartInfo
            {
                FileName = appUrl,
                UseShellExecute = true
            };
            System.Diagnostics.Process.Start(psi);
            Console.WriteLine($"✅ Swagger ouvert automatiquement sur: {appUrl}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ Impossible d'ouvrir automatiquement le navigateur: {ex.Message}");
            Console.WriteLine($"📋 Veuillez ouvrir manuellement: {appUrl}");
        }
    }
    
    Console.WriteLine("👤 Utilisateur admin par défaut:");
    Console.WriteLine("   - Username: admin");
    Console.WriteLine("   - Email: admin@backend.com");
    Console.WriteLine("   - Password: Admin123*");
    Console.WriteLine("   - Role: Admin");
});

app.Run();
