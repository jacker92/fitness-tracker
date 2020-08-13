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
        Task<UpdateProfileResponse> UpdateUserProfile(User user, UpdateProfileRequest req);
    }
}