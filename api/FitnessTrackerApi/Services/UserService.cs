using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly IRepository<DailyTarget> _dailyTargetRepository;

        public UserService(UserManager<User> userManager, SignInManager<User> signInManager, IHostEnvironment hostEnvironment, IRepository<DailyTarget> dailyTargetRepo)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _hostEnvironment = hostEnvironment;
            _dailyTargetRepository = dailyTargetRepo;
        }

        public async Task<RegistrationResponse> RegisterUser(RegistrationRequest request)
        {
            try
            {
                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    UserName = request.Email,
                    MeasurementSystem = MeasurementSystem.US
                };

                var result = await _userManager.CreateAsync(user, request.Password);

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

        public async Task<AuthenticationResponse> Authenticate(AuthenticationRequest request)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user != null)
                {
                    var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

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

        public async Task<User> GetUserRecord(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user != null)
            {
                user.DailyTarget = _dailyTargetRepository.Get(r => r.UserID == user.Id).FirstOrDefault();
            }

            return user;
        }

        public async Task<CheckEmailResponse> CheckEmail(string id, string email)
        {
            var response = new CheckEmailResponse();

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return response;
            }

            if (user.Id != id)
            {
                response.Valid = false;
            }

            return response;
        }

        public async Task<UpdateProfileResponse> UpdateUserProfile(User user, UpdateProfileRequest request)
        {
            try
            {
                user.Email = request.Email;
                user.UserName = request.Email;
                user.Name = request.Name;
                user.Height = request.Height;
                user.Birthday = request.Birthday;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return new UpdateProfileResponse();
                }

                return new UpdateProfileResponse
                {
                    Successful = false,
                    ErrorMessage = "Unable to update profile"
                };
            }
            catch (Exception ex)
            {
                return new UpdateProfileResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<ImageUploadResponse> UpdateAvatar(User user, AvatarUploadRequest request)
        {
            try
            {
                string path = Path.Combine(_hostEnvironment.ContentRootPath, $"Uploads/avatars/{user.Id}.jpg");

                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }

                byte[] imageData = await Utilities.SaveImage(request.Image, path);

                if (imageData == null || imageData.Length == 0)
                {
                    return new ImageUploadResponse
                    {
                        Successful = false,
                        ErrorMessage = "Unable to upload image"
                    };
                }

                user.Avatar = $"/Uploads/avatars/{user.Id}.jpg";
                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return new ImageUploadResponse
                    {
                        Image = GetUserAvatar(user)
                    };
                }

                return new ImageUploadResponse
                {
                    Successful = false,
                    ErrorMessage = "Unable to update avatar"
                };
            }
            catch (Exception ex)
            {
                return new ImageUploadResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public string GetUserAvatar(User user)
        {
            string path = Path.Combine(_hostEnvironment.ContentRootPath, $"Uploads/avatars/{user.Id}.jpg");
            return Utilities.ConvertImageToBase64(path);
        }

        public async Task<BaseResponse> RemoveAvatar(User user)
        {
            string path = Path.Combine(_hostEnvironment.ContentRootPath, $"Uploads/avatars/{user.Id}.jpg");
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }

            user.Avatar = "";
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return new BaseResponse();
            }

            return new BaseResponse
            {
                Successful = false,
                ErrorMessage = "Unable to delete avatar"
            };
        }

        public async Task<UpdateActivitySettingsResponse> UpdateActivitySettings(User user, UpdateActivitySettingsRequest request)
        {
            try
            {
                if (user != null)
                {
                    user.DailyTarget = _dailyTargetRepository.Get(r => r.UserID == user.Id).FirstOrDefault();
                }

                user.CaloriesBurnedSetting = request.CaloriesBurnedSetting;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    user.DailyTarget.EnableActiveMinuteTarget = request.EnableActiveMinuteTarget;
                    user.DailyTarget.ActiveMintueTarget = request.ActiveMintueTarget;
                    user.DailyTarget.EnableCaloriesBurnedTarget = request.EnableCaloriesBurnedTarget;
                    user.DailyTarget.CaloriesBurnedTarget = request.CaloriesBurnedTarget;

                    await _dailyTargetRepository.Update(user.DailyTarget);

                    return new UpdateActivitySettingsResponse();
                }

                return new UpdateActivitySettingsResponse
                {
                    Successful = false,
                    ErrorMessage = "Unable to update activity settings"
                };
            }
            catch (Exception ex)
            {
                return new UpdateActivitySettingsResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private string generateJwtToken(User user)
        {
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