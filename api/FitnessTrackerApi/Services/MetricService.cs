using FitnessTrackerApi.Models;
using FitnessTrackerApi.Repositories;
using System.Linq;

namespace FitnessTrackerApi.Services
{
    public class MetricService : IMetricService
    {
        private readonly IRepository<Metric> _metricRepository;

        public MetricService(IRepository<Metric> metricRepo)
        {
            _metricRepository = metricRepo;
        }

        public Metric GetById(int id)
        {
            return _metricRepository.Get(m => m.ID == id).FirstOrDefault();
        }
    }
}