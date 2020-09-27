using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using FitnessTrackerApi.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public class MetricService : IMetricService
    {
        private readonly IRepository<Metric> _metricRepository;
        private readonly IRepository<UserTrackedMetric> _userTrackedMetricRepository;
        private readonly IRepository<UserMetric> _userMetricRepository;

        public MetricService(IRepository<Metric> metricRepo, IRepository<UserTrackedMetric> userTrackedMetricRepo, IRepository<UserMetric> userMetricRepo)
        {
            _metricRepository = metricRepo;
            _userTrackedMetricRepository = userTrackedMetricRepo;
            _userMetricRepository = userMetricRepo;
        }

        public Metric GetById(int id)
        {
            return _metricRepository.GetById(id);
        }

        public async Task<EditMetricResponse> AddMetric(User user, AddMetricRequest request)
        {
            try
            {
                if (user != null)
                {
                    var metric = new Metric
                    {
                        Name = request.Name,
                        Units = request.Units,
                        Type = request.Type,
                        UserID = user.Id,
                        IsSystem = false
                    };

                    await _metricRepository.Add(metric);

                    var userTrackedMetric = new UserTrackedMetric
                    {
                        UserID = user.Id,
                        MetricID = metric.ID,
                        IsTracked = true
                    };

                    await _userTrackedMetricRepository.Add(userTrackedMetric);

                    var trackedMetrics = _userTrackedMetricRepository.Get(utm => utm.UserID == user.Id, utm => utm.Metric)
                                            .OrderBy(utm => utm.Metric.Name)
                                            .ToList();

                    return new EditMetricResponse
                    {
                        Successful = true,
                        Metrics = trackedMetrics
                    };
                }

                return new EditMetricResponse
                {
                    Successful = false,
                    ErrorMessage = "Cannot find user"
                };
            }
            catch (Exception ex)
            {
                return new EditMetricResponse
                {
                    Successful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<EditMetricResponse> UpdateMetric(User user, UpdateMetricRequest request)
        {
            if (user != null)
            {
                var metric = _metricRepository.GetById(request.ID);

                // for safety, confirm that the user owns the metric and it's not a system metric
                if (metric == null || metric.UserID != user.Id || metric.IsSystem)
                {
                    return new EditMetricResponse
                    {
                        ErrorMessage = "Cannot find metric"
                    };
                }

                metric.Name = request.Name;
                metric.Units = request.Units;
                metric.Type = request.Type;

                await _metricRepository.Update(metric);

                var trackedMetrics = _userTrackedMetricRepository.Get(utm => utm.UserID == user.Id, utm => utm.Metric)
                                        .OrderBy(utm => utm.Metric.Name)
                                        .ToList();

                return new EditMetricResponse
                {
                    Metrics = trackedMetrics
                };
            }

            return new EditMetricResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }

        public async Task<EditMetricResponse> DeleteMetric(User user, DeleteMetricRequest request)
        {
            if (user != null)
            {
                var metric = _metricRepository.GetById(request.ID);

                // for safety, confirm that the user owns the metric and it's not a system metric
                if (metric == null || metric.UserID != user.Id || metric.IsSystem)
                {
                    return new EditMetricResponse
                    {
                        ErrorMessage = "Cannot find metric"
                    };
                }

                // delete all records from the user metrics table
                await _userMetricRepository.DeleteRange(_userMetricRepository.Get(um => um.UserID == user.Id && um.MetricID == metric.ID).ToList());

                // delete the tracked record
                await _userTrackedMetricRepository.DeleteRange(_userTrackedMetricRepository.Get(utm => utm.UserID == user.Id && utm.MetricID == metric.ID).ToList());

                // finally delete the metric itself
                await _metricRepository.Delete(metric);

                var trackedMetrics = _userTrackedMetricRepository.Get(utm => utm.UserID == user.Id, utm => utm.Metric)
                                        .OrderBy(utm => utm.Metric.Name)
                                        .ToList();

                return new EditMetricResponse
                {
                    Metrics = trackedMetrics
                };
            }

            return new EditMetricResponse
            {
                ErrorMessage = "Cannot find user"
            };
        }
    }
}