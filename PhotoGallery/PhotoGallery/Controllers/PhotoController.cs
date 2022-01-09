using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PhotoGallery.Auth.Models;
using PhotoGallery.DTO;
using PhotoGallery.Models;
using PhotoGallery.Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PhotoGallery.Controllers
{
    [ApiController]
    [Route("api/photos")]
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoRepository _photoRepository;
        private readonly PhotoGalleryDBContext _photoGallerDbContext;
        private readonly IAuthorizationService _authorizationService;

        public PhotoController(IPhotoRepository photoRepository, PhotoGalleryDBContext photoGallerDbContext, IAuthorizationService authorizationService) 
        {
            _photoRepository = photoRepository;
            _photoGallerDbContext = photoGallerDbContext;
            _authorizationService = authorizationService;
        }
        [HttpGet]
        public async Task<ICollection<Photo>> GetAll()
        {
            return await _photoRepository.GetAll();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Photo>> Get(int id)
        {
            var photo = await _photoRepository.Get(id);
            if (photo == null) return NotFound($"Photo with id '{id}' not found.");
            return photo;
        }
        [HttpGet("user:{username}")]
        public async Task<ICollection<Photo>> GetUserPhotos(string username) 
        {
            var user = _photoGallerDbContext.Users.FirstOrDefault(x => x.Username == username);
            if(user == null) return (ICollection<Photo>)NotFound($"User with username: '{username}' not found.");
            return await _photoRepository.GetUserPhotos(user);
        }
        [HttpGet("{id}/comments")]
        public async Task<ActionResult<List<Comment>>> GetComments(int id)
        {
            var photo = await _photoRepository.Get(id);
            if (photo == null) return NotFound($"Photo with id '{id}' not found.");
            List<Comment> oldList = _photoGallerDbContext.Comments.Where(x => x.PhotoId == photo.Id).ToList();
            List<Comment> newList = oldList.Select(x => new Comment { Id = x.Id, Content = x.Content, PhotoId = x.PhotoId, Photo = photo }).ToList();
            return newList;
        }
        [HttpPost]
        [Route("post")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(PhotoDTO photoDto)
        {
            var user = _photoGallerDbContext.Users.FirstOrDefault(x => x.Username == User.Identity.Name);
            if (user == null) return NotFound($"User with username: '{user.Username}' not found.");
            var photo = new Photo { Category = photoDto.Category, Url = photoDto.Url, User = user, UserId = user.AspNetUserId, CreateAt = DateTime.Now};
            await _photoRepository.Add(photo);
            return Created($"/api/photos/{photo.Id}", photo);
        }
        [HttpPut]
        [Route("update")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult<Photo>> UpdatePhoto(int id, PhotoDTO photo)
        {
            var photoUp = await _photoRepository.Get(id);

            var authResult = await _authorizationService.AuthorizeAsync(User, photoUp, PolicyNames.SameUser);

            if (!authResult.Succeeded) 
            {
                return Forbid();
            }
            if (photoUp == null) return NotFound($"Photo with id '{id}' not found.");
            await _photoRepository.Update(photoUp, photo);
            return Ok(photo);
        }
        [HttpDelete]
        [Route("remove/{id}")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult> DeletePhoto(int id)
        {
            var photo = await _photoRepository.Get(id);

            var authResult = await _authorizationService.AuthorizeAsync(User, photo, PolicyNames.SameUser);

            if (!authResult.Succeeded)
            {
                return Forbid();
            }
            if (photo == null) return NotFound($"Photo with id '{id}' not found.");

            await _photoRepository.Delete(id);
            return NoContent();
        }
        [HttpPost]
        [Route("rate/{id}/{value}")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult> RatePhoto(int id, int value)
        {
            var user = _photoGallerDbContext.Users.FirstOrDefault(x => x.Username == User.Identity.Name);
            var photo = await _photoRepository.Get(id);

            if (photo == null) return NotFound($"Photo with id '{id}' not found.");

            await _photoRepository.RatePhoto(user, photo, value);
            return Ok();
        }

        [HttpGet]
        [Route("{id}/score")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult<int>> GetUserScore(int id) 
        {
            var user = _photoGallerDbContext.Users.FirstOrDefault(x => x.Username == User.Identity.Name);
            var photo = await _photoRepository.Get(id);
            var score = photo.PhotoScores?.FirstOrDefault(x => x.UserId == user.AspNetUserId);

            if (score != null)
            {
                var authResult = await _authorizationService.AuthorizeAsync(User, score, PolicyNames.SameUser);

                if (!authResult.Succeeded)
                {
                    return Forbid();
                }
          
                return score.Value;
            }
            return NotFound();
        }
    }
}
