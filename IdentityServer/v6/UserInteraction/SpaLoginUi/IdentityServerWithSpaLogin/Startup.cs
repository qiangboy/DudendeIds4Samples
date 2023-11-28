// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.


using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServerHost.Quickstart.UI;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.ConstrainedExecution;
using System.Security.Cryptography.X509Certificates;

namespace IdentityServerWithSpaLogin
{
    public class Startup
    {
        public IWebHostEnvironment Environment { get; }
        public IConfiguration Configuration { get; }

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            Environment = environment;
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
            var connectionString = Configuration["ConnectionStrings:Ids4"];


            // 项目根目录下的证书文件（证书使用openssl生成，有效期一年）
            var pfxPath = Path.Combine(System.Environment.CurrentDirectory, Configuration["Certificates:CerPath"]);
            // 生成X509证书
            var cert = new X509Certificate2(pfxPath, Configuration["Certificates:Password"]);

            services.AddIdentityServer(options =>
                {
                    options.UserInteraction.LoginUrl = "/login.html";
                    options.UserInteraction.ConsentUrl = "/consent.html";
                    options.UserInteraction.LogoutUrl = "/logout.html";
                    options.UserInteraction.ErrorUrl = "/error.html";

                    options.IssuerUri = Configuration["AuthServer:Authority"];

                    options.Authentication.CookieLifetime = TimeSpan.FromSeconds(30);

                    options.Events.RaiseErrorEvents = true;
                    options.Events.RaiseInformationEvents = true;
                    options.Events.RaiseFailureEvents = true;
                    options.Events.RaiseSuccessEvents = true;

                    // see https://docs.duendesoftware.com/identityserver/v5/fundamentals/resources/
                    options.EmitStaticAudienceClaim = true;

                    options.Authentication.CookieSameSiteMode = SameSiteMode.Lax;
                })
                .AddTestUsers(TestUsers.Users)
                .AddConfigurationStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                        sql => sql.MigrationsAssembly(migrationsAssembly));
                })
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = b => b.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                        sql => sql.MigrationsAssembly(migrationsAssembly));
                })
                .AddSigningCredential(cert);

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder.SetIsOriginAllowed(_ => true)
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();
                    });
            });

            services.ConfigureNonBreakingSameSiteCookies();

            var redis = ConnectionMultiplexer.Connect(Configuration["Redis:Configuration"]);
            services.AddDataProtection()
                .SetApplicationName(Configuration["Redis:ApplicationName"])
                .PersistKeysToStackExchangeRedis(redis, "DataProtection-Keys");
        }

        public void Configure(IApplicationBuilder app)
        {
            InitializeDatabase(app);

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseIdentityServerOrigin();

            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseCookiePolicy();

            app.UseRouting();
            app.UseCors("AllowAllOrigins");
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });
        }

        private void InitializeDatabase(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();
            serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();

            var context = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
            context.Database.Migrate();
            if (!context.Clients.Any())
            {
                foreach (var client in Config.Clients)
                {
                    context.Clients.Add(client.ToEntity());
                }
                context.SaveChanges();
            }

            if (!context.IdentityResources.Any())
            {
                foreach (var resource in Config.IdentityResources)
                {
                    context.IdentityResources.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }

            if (!context.ApiScopes.Any())
            {
                foreach (var resource in Config.ApiScopes)
                {
                    context.ApiScopes.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }
        }
    }
}