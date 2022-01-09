using Microsoft.AspNetCore.Identity;
using PhotoGallery.Repositories.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PhotoGallery.Models;
using Microsoft.AspNetCore.Authorization;
using PhotoGallery.Auth.Models;
using PhotoGallery.DTO;

namespace PhotoGallery.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IUserRepository _userRepository;
        private readonly IAuthorizationService _authorizationService;
        public UserController(UserManager<IdentityUser> userManager, IUserRepository userRepository, IAuthorizationService authorizationService)
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _authorizationService = authorizationService;
        }
        [HttpGet]
        public async Task<ICollection<User>> GetAll()
        {
            return await _userRepository.GetAll();
        }
        [HttpGet("{username}")]
        public async Task<ActionResult<User>> Get(string username)
        {
            var user = await _userRepository.Get(username);
            if (user == null) return NotFound($"User with id '{username}' not found.");
            return user;
        }
        [HttpPut]
        [Route("update/{username}")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult<User>> UpdateUser(string username, UserDTO user)
        {
            var userUp = await _userRepository.Get(username);
            var id = User.Claims.First(x => x.Type == "userId").Value;

            if (userUp.AspNetUserId != id)
            {
                return Forbid();
            }
            if (userUp == null) return NotFound($"User with username '{username}' not found.");
            await _userRepository.Update(userUp, user);
            return Ok(user);
        }
        [HttpGet("search")]
        public async Task<ActionResult<ICollection<User>>> SearchUsers([FromQuery] string pattern) 
        {
            var user = await _userRepository.SearchUsers(pattern);
            return Ok(user);
        }
    }
}
