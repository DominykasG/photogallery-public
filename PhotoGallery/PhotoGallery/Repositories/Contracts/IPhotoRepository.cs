using PhotoGallery.DTO;
using PhotoGallery.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Repositories.Contracts
{
    public interface IPhotoRepository
    {
        Task<Photo> Get(int id);
        Task<ICollection<Photo>> GetAll();
        Task<ICollection<Photo>> GetUserPhotos(User user);
        Task<Photo> Add(Photo photo);
        Task Update(Photo photo, PhotoDTO photoDTO);
        Task Delete(int id);
        Task RatePhoto(User user, Photo photo, int value);
    }
}
