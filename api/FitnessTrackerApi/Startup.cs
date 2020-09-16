using FitnessTrackerApi.Data;
using FitnessTrackerApi.Helpers;
using FitnessTrackerApi.Models;
using FitnessTrackerApi.Repositories;
using FitnessTrackerApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace FitnessTrackerApi
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            AppSettings config = new AppSettings();
            configuration.GetSection("Settings").Bind(config);
            Utilities.AppSettings = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddDbContext<FitnessDbContext>(options =>
                options
                    .UseSqlServer(Configuration.GetConnectionString("FitnessTracker")));

            services.AddDefaultIdentity<User>()
                .AddEntityFrameworkStores<FitnessDbContext>();

            services.AddIdentityServer()
                .AddApiAuthorization<User, FitnessDbContext>();

            services.AddAuthentication();

            services.AddControllers();

            // Repositories
            services.AddTransient<IRepository<Activity>, Repository<Activity>>();
            services.AddTransient<IRepository<DailyTarget>, Repository<DailyTarget>>();
            services.AddTransient<IRepository<Food>, Repository<Food>>();
            services.AddTransient<IRepository<FoodGrouping>, Repository<FoodGrouping>>();
            services.AddTransient<IRepository<FoodIntake>, Repository<FoodIntake>>();
            services.AddTransient<IRepository<Gear>, Repository<Gear>>();
            services.AddTransient<IRepository<Metric>, Repository<Metric>>();
            services.AddTransient<IRepository<Recipe>, Repository<Recipe>>();
            services.AddTransient<IRepository<RecipeFood>, Repository<RecipeFood>>();
            services.AddTransient<IRepository<UserActivity>, Repository<UserActivity>>();
            services.AddTransient<IRepository<UserMetric>, Repository<UserMetric>>();
            services.AddTransient<IRepository<UserTrackedMetric>, Repository<UserTrackedMetric>>();

            // Services
            services.AddScoped<IActivityService, ActivityService>();
            services.AddScoped<IGearService, GearService>();
            services.AddScoped<IMetricService, MetricService>();
            services.AddScoped<IUserService, UserService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            // app.UseIdentityServer();
            app.UseAuthorization();

            // global cors policy
            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            // custom jwt auth middleware
            app.UseMiddleware<JwtMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
