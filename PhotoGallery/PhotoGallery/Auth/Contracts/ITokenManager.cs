using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Auth.Contracts
{
    public interface ITokenManager
    {
        Task<string> CreateAccessTokenAsync(IdentityUser user);
        JwtSecurityToken DecodeAccessTokenAsync(string token);
    }
}
