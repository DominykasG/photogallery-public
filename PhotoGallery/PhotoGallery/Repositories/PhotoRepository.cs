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
    public class PhotoRepository : IPhotoRepository
    {
        private readonly PhotoGalleryDBContext _photoGallerDbContext;
        public PhotoRepository(PhotoGalleryDBContext photoGalleryDBContext)
        {
            _photoGallerDbContext = photoGalleryDBContext;
        }
        public async Task<Photo> Get(int id) 
        {
            return await _photoGallerDbContext.Photos.Include(x => x.User).Include(x => x.PhotoScores).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<ICollection<Photo>> GetAll() 
        {
            var photos = await _photoGallerDbContext.Photos.Include(x => x.User).Include(x => x.PhotoScores).ToListAsync();
            if (photos.Count > 9)
            {
                return photos.OrderBy(a => Guid.NewGuid()).ToList().GetRange(0, 9);
            }
            return photos.OrderBy(a => Guid.NewGuid()).ToList().GetRange(0, photos.Count);
        }
        public async Task<ICollection<Photo>> GetUserPhotos(User user)
        {
            var photos = await _photoGallerDbContext.Photos.Where(x => x.UserId == user.AspNetUserId).Include(x => x.PhotoScores).Include(x => x.Comments).ThenInclude(x => x.User).ToListAsync();
            photos.Reverse();
            return photos;
        }
        public async Task<Photo> Add(Photo photo) 
        {
            _photoGallerDbContext.Photos.Add(photo);
            await _photoGallerDbContext.SaveChangesAsync();
            return photo;
        }
        public async Task Update(Photo photo, PhotoDTO photoDTO) 
        {
            photo.Category = photoDTO.Category;
            photo.Url = photoDTO.Url;

            _photoGallerDbContext.Photos.Update(photo);
            await _photoGallerDbContext.SaveChangesAsync();
        }
        public async Task Delete (int id)
        {
            var photo = _photoGallerDbContext.Photos.FirstOrDefault(x => x.Id == id);
            _photoGallerDbContext.Photos.Remove(photo);
            await _photoGallerDbContext.SaveChangesAsync();
        }
        public async Task RatePhoto(User user, Photo photo, int value)
        {
            var currentScore = await _photoGallerDbContext.PhotoScores.FirstOrDefaultAsync(x => x.UserId == user.AspNetUserId && x.Photo.Id == photo.Id);

            if (currentScore != null)
            {
                if (currentScore.Value != value)
                {
                    currentScore.Value = value;
                    _photoGallerDbContext.PhotoScores.Update(currentScore);
                }
            }
            else
            {
                var score = new PhotoScore { PhotoId = photo.Id, UserId = user.AspNetUserId, Value = value };
                _photoGallerDbContext.PhotoScores.Add(score);
            }

            await _photoGallerDbContext.SaveChangesAsync();
        }
    }
}
