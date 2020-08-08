namespace FitnessTrackerApi.Models
{
    public class Activity
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public int EstimatedCaloriesBurnedPerMinute { get; set; }

        public MetricType MetricType { get; set; }

        public bool IsSystem { get; set; }
    }
}