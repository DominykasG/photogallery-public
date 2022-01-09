using Microsoft.AspNetCore.Identity;
using PhotoGallery.Auth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Auth
{
    public class DatabaseSeeder
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public DatabaseSeeder(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager) 
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public async Task SeedAsync() 
        {
            foreach (var role in UserRoles.All) 
            {
                var roleExist = await _roleManager.RoleExistsAsync(role);
                if (!roleExist) 
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            var newAdminUser = new IdentityUser
            {
                UserName = "admin",
                Email = "admin@admin.com"
            };

            var newUser = new IdentityUser
            {
                UserName = "user",
                Email = "user@user.com"
            };

            var newGuestUser = new IdentityUser
            {
                UserName = "guest",
                Email = "guest@guest.com"
            };

            var existingAdminUser = await _userManager.FindByNameAsync(newAdminUser.UserName);
            if (existingAdminUser == null) 
            {
                var createdAdminUserResult = await _userManager.CreateAsync(newAdminUser, "Password1!");
                if (createdAdminUserResult.Succeeded) 
                {
                    await _userManager.AddToRolesAsync(newAdminUser, UserRoles.All);
                }
            }
            var existingUser = await _userManager.FindByNameAsync(newUser.UserName);
            if (existingUser == null)
            {
                var createdUserResult = await _userManager.CreateAsync(newUser, "Password1!");
                if (createdUserResult.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newUser, UserRoles.User);
                }
            }
            var existingGuestUser = await _userManager.FindByNameAsync(newGuestUser.UserName);
            if (existingGuestUser == null)
            {
                var createdGuestUserResult = await _userManager.CreateAsync(newGuestUser, "Password1!");
                if (createdGuestUserResult.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newGuestUser, UserRoles.Guest);
                }
            }
        }
    }
}
