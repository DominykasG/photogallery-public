using PhotoGallery.Auth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Models
{
    public class Photo : IUserOwnedResource
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Category { get; set; }
        public DateTime CreateAt { get; set; }
        public string? UserId { get; set; }
        public User User { get; set; }
        public virtual ICollection<PhotoScore> PhotoScores { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
    }
}
