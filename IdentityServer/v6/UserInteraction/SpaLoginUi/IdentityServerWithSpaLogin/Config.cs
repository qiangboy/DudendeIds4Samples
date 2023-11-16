// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.


using Duende.IdentityServer.Models;
using IdentityModel;
using System.Collections.Generic;

namespace IdentityServerWithSpaLogin
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> IdentityResources =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
            };

        public static IEnumerable<ApiResource> ApiResources =>
            new ApiResource[]
            {
                new ApiResource("ms.shop", "电商微服务作用域")
                {
                    Scopes =
                    {
                        "ms.product",
                        "ms.order"
                    }
                },
                new ApiResource("ms.product", "电商微服务作用域")
                {
                    Scopes =
                    {
                        "ms.product"
                    }
                },
            };

        public static IEnumerable<ApiScope> ApiScopes =>
            new ApiScope[]
            {
                new ApiScope("ms.product", "产品服务"),
                new ApiScope("ms.order", "订单服务")
            };

        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                // interactive client using code flow + pkce
                new Client
                {
                    ClientId = "test",
                    ClientName= "test",
                    RequirePkce = true,
                    RequireClientSecret = false,
                    
                    AllowedGrantTypes = GrantTypes.Code,

                    AllowAccessTokensViaBrowser = true,
                    AllowOfflineAccess = true,

                    AccessTokenLifetime = 15,

                    RequireConsent = false,

                    //RedirectUris = { "http://localhost:5003/callback.html", "http://localhost:5003/silentrenew.html" },
                    //PostLogoutRedirectUris = { "http://localhost:5003/index.html" },
                    //AllowedCorsOrigins = { "http://localhost:5003" },

                    RedirectUris = 
                    {
                        "http://localhost:5003/callback.html", 
                        "http://localhost:5003/silentrenew.html",
                        "http://124.221.169.49:5003/callback.html",
                        "http://124.221.169.49:5003/silentrenew.html",
                        "http://4ygtt367.dongtaiyuming.net:22370/callback.html",
                        "http://4ygtt367.dongtaiyuming.net:22370/silentrenew.html"
                    },
                    PostLogoutRedirectUris =
                    {
                        "http://localhost:5003/index.html",
                        "http://124.221.169.49:5003/index.html",
                        "http://4ygtt367.dongtaiyuming.net:22370/index.html"
                    },
                    AllowedCorsOrigins =
                    {
                        "http://localhost:5003",
                        "http://124.221.169.49:5003",
                        "http://4ygtt367.dongtaiyuming.net:22370"
                    },

                    AllowedScopes = { "openid", "profile", "ms.product", "ms.order", OidcConstants.StandardScopes.OfflineAccess }
                },
            };
    }
}