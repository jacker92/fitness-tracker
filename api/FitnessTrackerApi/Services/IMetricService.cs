using FitnessTrackerApi.Models;
using System.Threading.Tasks;

namespace FitnessTrackerApi.Services
{
    public interface IMetricService
    {
        Metric GetById(int id);
    }
}