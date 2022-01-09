using PhotoGallery.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.DTO
{
    public class GetPhotoDTO
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public int Score { get; set; }
        public bool Voted { get; set; }
        public static GetPhotoDTO Create(Photo photo, User user) 
        {
            int score = 0;
            bool voted = false;
            if (photo == null)
            {
                return null;
            }
            if (photo.PhotoScores != null && photo.PhotoScores.Count > 0)
            {
                score = photo.PhotoScores.Sum(x => x.Value);
                var val = photo.PhotoScores.FirstOrDefault(x => x.UserId == user.AspNetUserId);
                if (val != null)
                {
                    if (val.Value == 0)
                    {
                        voted = false;
                    }
                    if (val.Value == 1)
                    {
                        voted = true;
                    }
                }
            }
            return new GetPhotoDTO
            {
                Id = photo.Id,
                Url = photo.Url,
                CreatedAt = photo.CreateAt,
                UserId = photo.UserId,
                User = photo.User,
                Comments = photo.Comments,
                Score = score,
                Voted = voted,
            };
        }
    }
}
