using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PhotoGallery.DTO;
using PhotoGallery.Models;
using PhotoGallery.Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly PhotoGalleryDBContext _photoGallerDbContext;
        private readonly UserManager<IdentityUser> _userManager;

        public UserRepository(PhotoGalleryDBContext photoGallerDbContext, UserManager<IdentityUser> userManager) 
        {
            _photoGallerDbContext = photoGallerDbContext;
            _userManager = userManager;
        }
        public async Task<User> Get(string username) 
        {
            return await _photoGallerDbContext.Users.FirstOrDefaultAsync(x => x.Username == username);
        }
        public async Task<ICollection<User>> GetAll() 
        {
            return await _photoGallerDbContext.Users.ToListAsync();
        }
        public async Task<List<User>> SearchUsers(string pattern) 
        {
            try
            {
                if (pattern == null)
                {
                    return null;
                }
                string pat = pattern.ToLower();
                var filtered = await _photoGallerDbContext.Users.Where(x => x.Username.ToLower().Contains(pat)).ToListAsync();

                return filtered.ToList();
            }
            catch (Exception ex)
            {
                var a = ex;
                throw null;
            }
        }
        public async Task<User> Add(User user)
        {
            _photoGallerDbContext.Users.Add(user);
            await _photoGallerDbContext.SaveChangesAsync();
            return user;
        }
        public async Task Update(User user, UserDTO userDTO) 
        {
            user.Name = userDTO.Name;
            user.Title = userDTO.Title;
            user.Description = userDTO.Description;
            user.ImageUrl = userDTO.ImageUrl;

            _photoGallerDbContext.Users.Update(user);
            await _photoGallerDbContext.SaveChangesAsync();
        }
        public async Task Delete(int id) 
        {
            await _photoGallerDbContext.SaveChangesAsync();
        }
    }
}
