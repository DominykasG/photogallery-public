using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string AspNetUserId { get; set; }
        [ForeignKey("AspNetUserId")]
        public virtual IdentityUser AspNetUser { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<PhotoScore> PhotoScores { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<CommentScore> CommentScores { get; set; }
    }
}
