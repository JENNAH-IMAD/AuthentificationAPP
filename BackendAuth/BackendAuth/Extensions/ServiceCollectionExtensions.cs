using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using BackendAuth.Data;
using BackendAuth.Security;
using BackendAuth.Services;

namespace BackendAuth.Extensions;

/// <summary>
/// Extensions pour configurer les services
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Configure la base de données PostgreSQL
    /// </summary>
    /// <param name="services">Collection de services</param>
    /// <param name="connectionString">Chaîne de connexion</param>
    /// <returns>Collection de services</returns>
    public static IServiceCollection AddDatabase(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        return services;
    }

    /// <summary>
    /// Configure les services d'application
    /// </summary>
    /// <param name="services">Collection de services</param>
    /// <returns>Collection de services</returns>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Services métier
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<AuthService>();
        services.AddScoped<JwtService>();

        return services;
    }

    /// <summary>
    /// Configure Swagger avec support JWT
    /// </summary>
    /// <param name="services">Collection de services</param>
    /// <returns>Collection de services</returns>
    public static IServiceCollection AddSwaggerWithJwt(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo 
            { 
                Title = "BackendAuth API", 
                Version = "v1",
                Description = "API d'authentification avec JWT et gestion des utilisateurs"
            });

            // Configuration JWT pour Swagger
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header utilisant le schéma Bearer. Exemple: \"Authorization: Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });

            // Inclure les commentaires XML
            var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath))
            {
                c.IncludeXmlComments(xmlPath);
            }
        });

        return services;
    }

    /// <summary>
    /// Configure CORS
    /// </summary>
    /// <param name="services">Collection de services</param>
    /// <returns>Collection de services</returns>
    public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
        });

        return services;
    }
} 