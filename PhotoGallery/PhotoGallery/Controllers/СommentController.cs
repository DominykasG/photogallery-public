using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhotoGallery.Auth.Models;
using PhotoGallery.DTO;
using PhotoGallery.Models;
using PhotoGallery.Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Controllers
{
    [ApiController]
    [Route("api/comments")]
    public class СommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        private readonly PhotoGalleryDBContext _photoGallerDbContext;
        private readonly IAuthorizationService _authorizationService;

        public СommentController(ICommentRepository commentRepository, PhotoGalleryDBContext photoGallerDbContext, IAuthorizationService authorizationService)
        {
            _commentRepository = commentRepository;
            _photoGallerDbContext = photoGallerDbContext;
            _authorizationService = authorizationService;
        }
        [HttpGet]
        [Authorize(Roles = UserRoles.User + "," + UserRoles.Guest)]
        public async Task<ICollection<Comment>> GetAll()
        {
            return await _commentRepository.GetAll();
        }
        [HttpGet("{id}")]
        [Authorize(Roles = UserRoles.User + "," + UserRoles.Guest)]
        public async Task<ActionResult<Comment>> Get(int id)
        {
            var comment = await _commentRepository.Get(id);
            if (comment == null) return NotFound($"Comment  with id '{id}' not found.");
            return comment;
        }
        [HttpPost]
        [Route("post")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult<CommentDTO>> AddComment(CommentDTO commentDTO)
        {
            var user = _photoGallerDbContext.Users.FirstOrDefault(x => x.Username == User.Identity.Name);
            var photo = _photoGallerDbContext.Photos.FirstOrDefault(x => x.Id == commentDTO.PhotoId);

            if (photo == null) return NotFound($"Photo  with id '{commentDTO.PhotoId}' not found.");   

            var comment = new Comment { Content = commentDTO.Content, Photo = photo, PhotoId = commentDTO.PhotoId, User = user, UserId = user.AspNetUserId};

            await _commentRepository.Add(comment);
            return Created($"/api/comments/{comment.Id}", comment);
        }
        [HttpPut]
        [Route("update")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult<Comment>> UpdatedComment(CommentDTO commentDTO, int id)
        {
            var commentUp = await _commentRepository.Get(id);

            var authResult = await _authorizationService.AuthorizeAsync(User, commentUp, PolicyNames.SameUser);

            if (!authResult.Succeeded)
            {
                return Forbid();
            }
            if (commentUp == null) return NotFound($"Comment with id '{id}' not found.");
            await _commentRepository.Update(commentUp, commentDTO);
            return Ok(commentDTO);
        }
        [HttpDelete]
        [Route("remove/{id}")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult> DeleteComment(int id)
        {
            var comment = await _commentRepository.Get(id);

            var authResult = await _authorizationService.AuthorizeAsync(User, comment, PolicyNames.SameUser);

            if (!authResult.Succeeded)
            {
                return Forbid();
            }
            if (comment == null) return NotFound($"Comment with id '{id}' not found.");

            await _commentRepository.Delete(id);
            return NoContent();
        }
        [HttpPost]
        [Route("rate")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<ActionResult> RateComment(int id, int value)
        {
            var user = _photoGallerDbContext.Users.FirstOrDefault(x => x.Username == User.Identity.Name);
            var comment = await _commentRepository.Get(id);
            
            var authResult = await _authorizationService.AuthorizeAsync(User, comment, PolicyNames.SameUser);

            if (!authResult.Succeeded)
            {
                return Forbid();
            }
            if(comment == null) return NotFound($"Comment with id '{id}' not found.");

            await _commentRepository.RateComment(user, comment, value);
            return Ok();
        }
    }
}
