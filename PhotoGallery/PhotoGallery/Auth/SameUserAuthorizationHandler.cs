using Microsoft.AspNetCore.Authorization;
using PhotoGallery.Auth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Auth
{
    public class SameUserAuthorizationHandler : AuthorizationHandler<SameUserRequirement, IUserOwnedResource>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SameUserRequirement requirement, IUserOwnedResource resource)
        {
            if (context.User.IsInRole(UserRoles.Admin) || context.User.FindFirst(CustomClaims.UserId).Value == resource.UserId) 
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
    public record SameUserRequirement : IAuthorizationRequirement;
}
