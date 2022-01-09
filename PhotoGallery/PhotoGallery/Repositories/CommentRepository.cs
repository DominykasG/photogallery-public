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
    public class CommentRepository : ICommentRepository
    {
        private readonly PhotoGalleryDBContext _photoGallerDbContext;
        public CommentRepository(PhotoGalleryDBContext photoGalleryDBContext)
        {
            _photoGallerDbContext = photoGalleryDBContext;
        }
        public async Task<Comment> Get(int id)
        {
            return await _photoGallerDbContext.Comments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<ICollection<Comment>> GetAll()
        {
            return await _photoGallerDbContext.Comments.Include(x => x.User).Include(x => x.CommentScores).ToListAsync();
        }
        public async Task<Comment> Add(Comment comment)
        {
            _photoGallerDbContext.Comments.Add(comment);
            await _photoGallerDbContext.SaveChangesAsync();
            return comment;
        }
        public async Task Update(Comment comment, CommentDTO commentDTO)
        {
            comment.Content = commentDTO.Content;

            _photoGallerDbContext.Comments.Update(comment);
            await _photoGallerDbContext.SaveChangesAsync();
        }
        public async Task Delete(int id)
        {
            var comment = _photoGallerDbContext.Comments.FirstOrDefault(x => x.Id == id);
            _photoGallerDbContext.Comments.Remove(comment);
            await _photoGallerDbContext.SaveChangesAsync();
        }
        public async Task RateComment(User user, Comment comment, int value)
        {
            var currentScore = await _photoGallerDbContext.CommentScores.FirstOrDefaultAsync(x => x.UserId == user.AspNetUserId && x.CommentId == comment.Id);

            if (currentScore != null)
            {
                if (currentScore.Value != value)
                {
                    currentScore.Value = value;
                    _photoGallerDbContext.CommentScores.Update(currentScore);
                }
            }
            else
            {
                var score = new CommentScore { CommentId = comment.Id, UserId = user.AspNetUserId, Value = value };
                _photoGallerDbContext.CommentScores.Add(score);
            }

            await _photoGallerDbContext.SaveChangesAsync();
        }
    }
}
