using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IUserService
    {
        Task<RegistrationResponse> RegisterUser(RegistrationRequest req);
        Task<AuthenticationResponse> Authenticate(AuthenticationRequest req);
        Task<User> GetById(string id);
        Task<User> GetUserRecord(string id);
        Task<CheckEmailResponse> CheckEmail(string id, string email);
        Task<UpdateProfileResponse> UpdateUserProfile(User user, UpdateProfileRequest req);
        Task<ImageUploadResponse> UpdateAvatar(User user, AvatarUploadRequest req);
        string GetUserAvatar(User user);
        Task<BaseResponse> RemoveAvatar(User user);
        Task<UpdateActivitySettingsResponse> UpdateActivitySettings(User user, UpdateActivitySettingsRequest req);
        Task<UpdateDietSettingsResponse> UpdateDietSettings(User user, UpdateDietSettingsRequest req);
    }
}