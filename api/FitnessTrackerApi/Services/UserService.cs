using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IRepository<DailyTarget> _dailyTargetRepository;

        public UserService(UserManager<User> userManager, SignInManager<User> signInManager, IRepository<DailyTarget> dailyTargetRepo)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dailyTargetRepository = dailyTargetRepo;
        }

        public async Task<RegistrationResponse> RegisterUser(RegistrationRequest model)
        {
            try
            {
                var user = new User
                {
                    Name = model.Name,
                    Email = model.Email,
                    UserName = model.Email
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    var dailyTarget = new DailyTarget
                    {
                        UserID = user.Id,
                        User = user,
                        EnableCalorieTarget = false,
                        CalorieTarget = 0,
                        EnableProteinTarget = false,
                        ProteinTarget = 0,
                        ProteinPercentage = 0.35M,
                        EnableCarbohydratesTarget = false,
                        CarbohydratesTarget = 0,
                        CarbohydratePercentage = 0.35M,
                        EnableFatTarget = false,
                        FatTarget = 0,
                        FatPercentage = 0.3M,
                        EnableSugarTarget = false,
                        SugarTarget = 0,
                        EnableActiveMinuteTarget = false,
                        ActiveMintueTarget = 0,
                        EnableCaloriesBurnedTarget = false,
                        CaloriesBurnedTarget = 0
                    };

                    await _dailyTargetRepository.Add(dailyTarget);

                    var token = generateJwtToken(user);

                    return new RegistrationResponse
                    {
                        UserID = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Token = token
                    };
                }

                return new RegistrationResponse
                {
                    ErrorMessage = "Unable to save user"
                };
            }
            catch (Exception ex)
            {
                return new RegistrationResponse
                {
                    ErrorMessage = $"Error registerring user: {ex.Message}"
                };
            }
        }

        public async Task<AuthenticationResponse> Authenticate(AuthenticationRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                await _signInManager.SignOutAsync();

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

                if (result.Succeeded)
                {
                    var token = generateJwtToken(user);
                    return new AuthenticationResponse(user, token);
                }
            }

            return null;
        }

        public async Task<User> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return user;
        }

        private string generateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Utilities.AppSettings.JwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}