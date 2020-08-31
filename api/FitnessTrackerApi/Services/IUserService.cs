using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IUserService
    {
        Task<RegistrationResponse> RegisterUser(RegistrationRequest request);
        Task<AuthenticationResponse> Authenticate(AuthenticationRequest request);
        Task<User> GetById(string id);
        Task<User> GetUserRecord(string id);
        Task<CheckEmailResponse> CheckEmail(string id, string email);
        Task<UpdateProfileResponse> UpdateUserProfile(User user, UpdateProfileRequest request);
        Task<ImageUploadResponse> UpdateAvatar(User user, AvatarUploadRequest request);
        string GetUserAvatar(User user);
        Task<BaseResponse> RemoveAvatar(User user);
        Task<UpdateActivitySettingsResponse> UpdateActivitySettings(User user, UpdateActivitySettingsRequest request);
        Task<UpdateDietSettingsResponse> UpdateDietSettings(User user, UpdateDietSettingsRequest request);
        Task<ChangePasswordResponse> ChangePassword(User user, ChangePasswordRequest request);
        UserMetricsResponse GetUserTrackedMetrics(User user);
        Task<ToggleUserMetricTrackingResponse> UpdateUserMetricTracking(User user, ToggleUserMetricTrackingRequest request);
    }
}