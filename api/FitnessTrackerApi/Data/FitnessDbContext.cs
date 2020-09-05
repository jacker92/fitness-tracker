using FitnessTrackerApi.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace FitnessTrackerApi.Data
{
    public class FitnessDbContext : ApiAuthorizationDbContext<User>
    {
        public DbSet<Activity> Activities { get; set; }

        public DbSet<DailyTarget> DailyTargets { get; set; }

        public DbSet<Food> Foods { get; set; }

        public DbSet<FoodGrouping> FoodGroupings { get; set; }

        public DbSet<FoodIntake> FoodIntakes { get; set; }

        public DbSet<Metric> Metrics { get; set; }

        public DbSet<Recipe> Recipes { get; set; }

        public DbSet<RecipeFood> RecipeFoods { get; set; }

        public DbSet<UserActivity> UserActivities { get; set; }

        public DbSet<UserMetric> UserMetrics { get; set; }

        public DbSet<UserTrackedMetric> UserTrackedMetrics
        {
            get; set;
        }
        public FitnessDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DailyTarget>()
                .HasOne(dt => dt.User)
                .WithOne(u => u.DailyTarget)
                .HasForeignKey<DailyTarget>(dt => dt.UserID);

            modelBuilder.Entity<Food>()
                .HasOne(f => f.User)
                .WithMany(u => u.Foods)
                .HasForeignKey(f => f.UserID);

            modelBuilder.Entity<FoodGrouping>()
                .HasOne(fg => fg.User)
                .WithMany(u => u.FoodGroupings)
                .HasForeignKey(fg => fg.UserID);

            modelBuilder.Entity<FoodIntake>()
                .HasOne(fi => fi.User)
                .WithMany(u => u.FoodEaten)
                .HasForeignKey(fi => fi.UserID);

            modelBuilder.Entity<FoodIntake>()
                .HasOne(fi => fi.Food)
                .WithOne()
                .HasForeignKey<FoodIntake>(fi => fi.FoodID);

            modelBuilder.Entity<FoodIntake>()
                .HasOne(fi => fi.Recipe)
                .WithOne()
                .HasForeignKey<FoodIntake>(fi => fi.RecipeID);

            modelBuilder.Entity<Recipe>()
                .HasOne(r => r.User)
                .WithMany(u => u.Recipes)
                .HasForeignKey(r => r.UserID);

            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Ingredients);

            modelBuilder.Entity<UserActivity>()
                .HasOne(ua => ua.Activity)
                .WithOne()
                .HasForeignKey<UserActivity>(ua => ua.ActivityID);

            modelBuilder.Entity<UserActivity>()
                .HasOne(ua => ua.User)
                .WithMany(u => u.Activities)
                .HasForeignKey(ua => ua.UserID);

            modelBuilder.Entity<UserMetric>()
                .HasOne(um => um.Metric)
                .WithOne()
                .HasForeignKey<UserMetric>(um => um.MetricID);

            modelBuilder.Entity<UserMetric>()
                .HasOne(um => um.User)
                .WithMany(u => u.MetricMeasurements)
                .HasForeignKey(um => um.UserID);

            modelBuilder.Entity<UserTrackedMetric>()
                .HasOne(utm => utm.User)
                .WithMany(u => u.TrackedMetrics)
                .HasForeignKey(utm => utm.UserID);

            modelBuilder.Entity<UserTrackedMetric>()
                .HasOne(utm => utm.Metric)
                .WithMany()
                .HasForeignKey(utm => utm.MetricID);

            modelBuilder.Entity<Metric>()
                .HasOne(m => m.User)
                .WithMany(u => u.Metrics)
                .HasForeignKey(m => m.UserID)
                .IsRequired(false);
        }
    }
}