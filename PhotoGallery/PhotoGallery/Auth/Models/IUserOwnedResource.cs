using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Auth.Models
{
    public interface IUserOwnedResource
    {
        string? UserId { get; }
    }
}
