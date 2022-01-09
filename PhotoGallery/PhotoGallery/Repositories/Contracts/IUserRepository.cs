using PhotoGallery.DTO;
using PhotoGallery.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Repositories.Contracts
{
    public interface IUserRepository
    {
        Task<User> Get(string username);
        Task<ICollection<User>> GetAll();
        Task<List<User>> SearchUsers(string pattern);
        Task<User> Add(User user);
        Task Update(User user, UserDTO userDTO);
        Task Delete(int aspNetUserId);
    }
}
