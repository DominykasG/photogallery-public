using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Models
{
    public class CommentScore
    {
        public int Id { get; set; }
        public int Value { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int CommentId { get; set; }
        public Comment Comment { get; set; }
    }
}
