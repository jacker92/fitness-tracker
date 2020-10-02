using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Services;
using Moq;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Tests.Mocks.Services
{
    public class MockUserService : Mock<IUserService>
    {
        public MockUserService MockRegisterUser(RegistrationResponse response)
        {
            Setup(x => x.RegisterUser(It.IsAny<RegistrationRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockAuthenticate(AuthenticationResponse response)
        {
            Setup(x => x.Authenticate(It.IsAny<AuthenticationRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockGetById(User user)
        {
            Setup(x => x.GetById(It.IsAny<string>()))
                .Returns(Task.FromResult(user));

            return this;
        }

        public MockUserService MockGetUserRecord(User user)
        {
            Setup(x => x.GetUserRecord(It.IsAny<string>()))
                .Returns(Task.FromResult(user));

            return this;
        }

        public MockUserService MockCheckEmail(CheckEmailResponse response)
        {
            Setup(x => x.CheckEmail(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockUpdateUserProfile(UpdateProfileResponse response)
        {
            Setup(x => x.UpdateUserProfile(It.IsAny<User>(), It.IsAny<UpdateProfileRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockUpdateAvatar(ImageUploadResponse response)
        {
            Setup(x => x.UpdateAvatar(It.IsAny<User>(), It.IsAny<AvatarUploadRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockGetUserAvatar(string avatar)
        {
            Setup(x => x.GetUserAvatar(It.IsAny<User>()))
                .Returns(avatar);

            return this;
        }

        public MockUserService MockRemoveAvatar(BaseResponse response)
        {
            Setup(x => x.RemoveAvatar(It.IsAny<User>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockUpdateActivitySettings(UpdateActivitySettingsResponse response)
        {
            Setup(x => x.UpdateActivitySettings(It.IsAny<User>(), It.IsAny<UpdateActivitySettingsRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockUpdateDietSettings(UpdateDietSettingsResponse response)
        {
            Setup(x => x.UpdateDietSettings(It.IsAny<User>(), It.IsAny<UpdateDietSettingsRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockChangePassword(ChangePasswordResponse response)
        {
            Setup(x => x.ChangePassword(It.IsAny<User>(), It.IsAny<ChangePasswordRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockGetUserTrackedMetrics(UserMetricsResponse response)
        {
            Setup(x => x.GetUserTrackedMetrics(It.IsAny<User>()))
                .Returns(response);

            return this;
        }

        public MockUserService MockUpdateUserMetricTracking(ToggleUserMetricTrackingResponse response)
        {
            Setup(x => x.UpdateUserMetricTracking(It.IsAny<User>(), It.IsAny<ToggleUserMetricTrackingRequest>()))
                .Returns(Task.FromResult(response));

            return this;
        }

        public MockUserService MockGetUserGear(UserGearResponse response)
        {
            Setup(x => x.GetUserGear(It.IsAny<User>()))
                .Returns(response);

            return this;
        }

        public MockUserService MockGetUserCustomActivities(UserCustomActivityResponse response)
        {
            Setup(x => x.GetUserCustomActivities(It.IsAny<User>()))
                .Returns(response);

            return this;
        }
    }
}