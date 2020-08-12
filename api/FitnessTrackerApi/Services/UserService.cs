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
                    UserName = model.Email,
                    MeasurementSystem = MeasurementSystem.US
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    var dailyTarget = new DailyTarget
                    {
                        UserID = user.Id,
                        User = user
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
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user != null)
                {
                    var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

                    if (result.Succeeded)
                    {
                        var token = generateJwtToken(user);

                        return new AuthenticationResponse
                        {
                            UserID = user.Id,
                            Name = user.Name,
                            Email = user.Email,
                            Token = token
                        };
                    }
                    else
                    {
                        return new AuthenticationResponse
                        {
                            ErrorMessage = "Invalid email or password"
                        };
                    }
                }

                return new AuthenticationResponse
                {
                    ErrorMessage = "Error authenticating user"
                };
            }
            catch (Exception ex)
            {
                return new AuthenticationResponse
                {
                    ErrorMessage = $"Error authenticating user: {ex.Message}"
                };
            }

        }

        public async Task<User> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return user;
        }

        private string generateJwtToken(User user)
        {
            Console.WriteLine("IN GENERATEJWTTOKEN");
            var claims = new[] {
                new Claim("id", user.Id),
                new Claim("name", user.Name),
                new Claim("email", user.Email)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Utilities.AppSettings.JwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}