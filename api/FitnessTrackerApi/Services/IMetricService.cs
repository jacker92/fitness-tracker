using FitnessTrackerApi.Models;
using FitnessTrackerApi.Models.Requests;
using FitnessTrackerApi.Models.Responses;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IMetricService
    {
        Metric GetById(int id);
        Task<EditMetricResponse> AddMetric(User user, AddMetricRequest request);
        Task<EditMetricResponse> UpdateMetric(User user, UpdateMetricRequest request);
        Task<EditMetricResponse> DeleteMetric(User user, DeleteMetricRequest request);
    }
}