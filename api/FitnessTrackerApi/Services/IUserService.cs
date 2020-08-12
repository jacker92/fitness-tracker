using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IUserService
    {
        Task <RegistrationResponse> RegisterUser(RegistrationRequest model);
        Task<AuthenticationResponse> Authenticate(AuthenticationRequest model);
        Task<User> GetById(string id);
        Task<User> GetUserRecord(string id);
    }
}