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

                    RedirectUris = { "http://localhost:5003/callback.html", "http://localhost:5003/silentrenew.html" },
                    PostLogoutRedirectUris = { "http://localhost:5003/index.html" },
                    AllowedCorsOrigins = { "http://localhost:5003" },

                    AllowedScopes = { "openid", "profile", OidcConstants.StandardScopes.OfflineAccess }
                },
            };
    }
}