using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using System.Linq;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public class GearService : IGearService
    {
        private readonly IRepository<Gear> _gearRepository;

        public GearService(IRepository<Gear> gearRepo)
        {
            _gearRepository = gearRepo;
        }

        public Gear GetById(int id)
        {
            return _gearRepository.Get(m => m.ID == id).FirstOrDefault();
        }

        public async Task<EditGearResponse> AddGear(User user, AddGearRequest request)
        {
            if (user != null)
            {
                var gear = new Gear
                {
                    Name = request.Name,
                    UserID = user.Id
                };

                await _gearRepository.Add(gear);

                var gearList = _gearRepository.Get(g => g.UserID == user.Id).ToList();

                return new EditGearResponse
                {
                    Gear = gearList
                };
            }

            return new EditGearResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }

        public async Task<EditGearResponse> UpdateGear(User user, UpdateGearRequest request)
        {
            if (user != null)
            {
                var gear = _gearRepository.GetById(request.ID);

                // for safety, confirm that the user owns the gear
                if (gear == null || gear.UserID != user.Id)
                {
                    return new EditGearResponse
                    {
                        ErrorMessage = "Cannot find gear"
                    };
                }

                gear.Name = request.Name;

                await _gearRepository.Update(gear);

                var gearList = _gearRepository.Get(g => g.UserID == user.Id).ToList();

                return new EditGearResponse
                {
                    Gear = gearList
                };
            }

            return new EditGearResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }

        public async Task<EditGearResponse> DeleteGear(User user, DeleteGearRequest request)
        {
            if (user != null)
            {
                var gear = _gearRepository.GetById(request.ID);

                // for safety, confirm that the user owns the metric and it's not a system metric
                // for safety, confirm that the user owns the gear
                if (gear == null || gear.UserID != user.Id)
                {
                    return new EditGearResponse
                    {
                        ErrorMessage = "Cannot find gear"
                    };
                }

                // TODO: NULL out all activities that use this gear

                await _gearRepository.Delete(gear);

                var gearList = _gearRepository.Get(g => g.UserID == user.Id).ToList();

                return new EditGearResponse
                {
                    Gear = gearList
                };
            }

            return new EditGearResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }

        public async Task<EditGearResponse> SetGearActiveFlag(User user, SetGearActiveFlagRequest request)
        {
            if (user != null)
            {
                var gear = _gearRepository.GetById(request.ID);

                // for safety, confirm that the user owns the gear
                if (gear == null || gear.UserID != user.Id)
                {
                    return new EditGearResponse
                    {
                        ErrorMessage = "Cannot find gear"
                    };
                }

                gear.Active = request.Active;

                await _gearRepository.Update(gear);

                var gearList = _gearRepository.Get(g => g.UserID == user.Id).ToList();

                return new EditGearResponse
                {
                    Gear = gearList
                };
            }

            return new EditGearResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }
    }
}