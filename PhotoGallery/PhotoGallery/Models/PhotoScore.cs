using PhotoGallery.Auth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Models
{
    public class PhotoScore : IUserOwnedResource
    {
        public int Id { get; set; }
        public int Value { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int PhotoId { get; set; }
        public Photo Photo { get; set; }
    }
}
