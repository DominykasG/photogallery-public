using PhotoGallery.DTO;
using PhotoGallery.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Repositories.Contracts
{
    public interface ICommentRepository
    {
        Task<Comment> Get(int id);
        Task<ICollection<Comment>> GetAll();
        Task<Comment> Add(Comment comment);
        Task Update(Comment comment, CommentDTO commentDTO);
        Task Delete(int id);
        Task RateComment(User user, Comment comment, int value);
    }
}
