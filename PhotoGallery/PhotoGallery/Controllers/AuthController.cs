using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhotoGallery.Auth;
using PhotoGallery.Auth.Contracts;
using PhotoGallery.Auth.Models;
using PhotoGallery.DTO;
using PhotoGallery.Models;
using PhotoGallery.Repositories;
using PhotoGallery.Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Authorize]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly PhotoGalleryDBContext _photoGalleryDBContext;
        private readonly IUserRepository _userRepository;
        private readonly ITokenManager _tokenManager;
        public AuthController(UserManager<IdentityUser> userManager, IUserRepository userRepository, ITokenManager tokenManager, PhotoGalleryDBContext photoGalleryDBContext) 
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _tokenManager = tokenManager;
            _photoGalleryDBContext = photoGalleryDBContext;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterUserDTO registerUserDTO) 
        {
            var userName = await _userManager.FindByNameAsync(registerUserDTO.Username);
            var userEmail = await _userManager.FindByEmailAsync(registerUserDTO.Email);
            if (userName != null || userEmail != null) 
            {
                return BadRequest("User already exists");
            }
            var newUser = new IdentityUser
            {
                UserName = registerUserDTO.Username,
                Email = registerUserDTO.Email
            };
            var result = await _userManager.CreateAsync(newUser, registerUserDTO.Password);

            if (!result.Succeeded)
            {
                return BadRequest("Could not create user");
            }
            await _userManager.AddToRoleAsync(newUser, UserRoles.User);

            var aspUser = await _userManager.FindByEmailAsync(registerUserDTO.Email);
            var userToAdd = new User { Username = aspUser.UserName, Email = aspUser.Email, AspNetUserId = aspUser.Id };
            await _userRepository.Add(userToAdd);
            return Ok();
        }
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login(LoginUserDTO loginUserDTO) 
        {
            var user = await _userManager.FindByNameAsync(loginUserDTO.Username);
            if (user == null) 
            {
                return BadRequest("Username or password is invalid");
            }
            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginUserDTO.Password);
            if (!isPasswordValid) 
            {
                return BadRequest("Username or password is invalid");
            }
            var accessToken = await _tokenManager.CreateAccessTokenAsync(user);

            return Ok(new SuccessfullLoginDTO { AccessToken = accessToken });
        }
        [HttpPost]
        [Authorize(Roles = UserRoles.User)]
        [Route("check-login")]
        public async Task<ActionResult> CheckLogin(CheckLoginDTO login)
        {
            var token = _tokenManager.DecodeAccessTokenAsync(login.Token);
            if (token == null || token.ValidFrom > DateTime.UtcNow || token.ValidTo < DateTime.UtcNow) 
            {
                return BadRequest("Token is invalid");
            }
            var role = token.Claims.ElementAt(3).Value;
            var userId = token.Claims.First(x => x.Type == "userId").Value;
            var user = await _photoGalleryDBContext.Users.FirstOrDefaultAsync(x => x.AspNetUserId == userId);
            if (user == null) 
            {
                return NotFound("User was not found");
            }
            return Ok(new { User = user, Role = role});
        }
    }
}
