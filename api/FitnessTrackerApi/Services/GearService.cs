using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using System;
using System.Collections.Generic;
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
            return _gearRepository.GetById(id);
        }

        public List<Gear> ListForUser(string userId)
        {
            try
            {
                return _gearRepository.Get(g => g.UserID == userId)
                                        .OrderBy(g => g.Name)
                                        .ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<GearListResponse> Add(User user, EditGearRequest request)
        {
            try
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

                    return new GearListResponse
                    {
                        Gear = gearList
                    };
                }

                return new GearListResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new GearListResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<GearListResponse> Update(User user, EditGearRequest request)
        {
            try
            {
                if (user != null)
                {
                    var gear = _gearRepository.GetById(request.ID);

                    // for safety, confirm that the user owns the gear
                    if (gear == null || gear.UserID != user.Id)
                    {
                        return new GearListResponse
                        {
                            Successful = false,
                            ErrorMessage = "Cannot find gear"
                        };
                    }

                    gear.Name = request.Name;

                    await _gearRepository.Update(gear);

                    var gearList = _gearRepository.Get(g => g.UserID == user.Id).ToList();

                    return new GearListResponse
                    {
                        Gear = gearList
                    };
                }

                return new GearListResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new GearListResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<GearListResponse> Delete(User user, DeleteRequest request)
        {
            try
            {
                if (user != null)
                {
                    var gear = _gearRepository.GetById(request.ID);

                    // for safety, confirm that the user owns the gear
                    if (gear == null || gear.UserID != user.Id)
                    {
                        return new GearListResponse
                        {
                            Successful = false,
                            ErrorMessage = "Cannot find gear"
                        };
                    }

                    // TODO: NULL out all activities that use this gear

                    await _gearRepository.Delete(gear);

                    var gearList = _gearRepository.Get(g => g.UserID == user.Id).ToList();

                    return new GearListResponse
                    {
                        Gear = gearList
                    };
                }

                return new GearListResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new GearListResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<GearListResponse> SetActiveFlag(User user, SetGearActiveFlagRequest request)
        {
            try
            {
                if (user != null)
                {
                    var gear = _gearRepository.GetById(request.ID);

                    // for safety, confirm that the user owns the gear
                    if (gear == null || gear.UserID != user.Id)
                    {
                        return new GearListResponse
                        {
                            Successful = false,
                            ErrorMessage = "Cannot find gear"
                        };
                    }

                    gear.Active = request.Active;

                    await _gearRepository.Update(gear);

                    var gearList = _gearRepository.Get(g => g.UserID == user.Id).ToList();

                    return new GearListResponse
                    {
                        Gear = gearList
                    };
                }

                return new GearListResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new GearListResponse { Successful = false, ErrorMessage = ex.Message };
            }
        }
    }
}