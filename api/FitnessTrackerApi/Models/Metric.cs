namespace FitnessTrackerApi.Models
{
    public class Metric
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Units { get; set; }

        public MetricType Type { get; set; }

        public bool IsSystem { get; set; }
    }
}