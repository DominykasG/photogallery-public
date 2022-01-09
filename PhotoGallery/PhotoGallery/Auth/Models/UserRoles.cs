using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Auth.Models
{
    public static class UserRoles
    {
        public const string Admin = nameof(Admin);
        public const string User = nameof(User);
        public const string Guest = nameof(Guest);

        public static readonly IReadOnlyCollection<string> All = new[] { Admin, User };
    }
}
