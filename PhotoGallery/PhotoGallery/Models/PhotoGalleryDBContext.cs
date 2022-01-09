using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoGallery.Models
{
    public class PhotoGalleryDBContext : IdentityDbContext<IdentityUser>
    {
        public PhotoGalleryDBContext() 
        { 
        }
        public PhotoGalleryDBContext(DbContextOptions<PhotoGalleryDBContext> options) : base(options)
        {
        }
        public virtual DbSet<Photo> Photos { get; set; }
        public virtual DbSet<PhotoScore> PhotoScores { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<CommentScore> CommentScores { get; set; }
        public virtual DbSet<User> Users { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Comment>().HasOne(x => x.Photo).WithMany(x => x.Comments).OnDelete(DeleteBehavior.Cascade);
            //modelBuilder.Entity<User>().HasMany(x => x.Comments).WithOne(x => x.User).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Comment>().HasOne(x => x.User).WithMany(x => x.Comments).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Photo>().HasOne(x => x.User).WithMany(x => x.Photos).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CommentScore>().HasOne(x => x.Comment).WithMany(x => x.CommentScores).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<CommentScore>().HasOne(x => x.User).WithMany(x => x.CommentScores).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PhotoScore>().HasOne(x => x.Photo).WithMany(x => x.PhotoScores).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<PhotoScore>().HasOne(x => x.User).WithMany(x => x.PhotoScores).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
