namespace FitnessTrackerApi.Models
{
    public class UserTrackedMetric
    {
        public int ID { get; set; }

        public string UserID { get; set; }

        public virtual User User { get; set; }

        public int MetricID { get; set; }

        public virtual Metric Metric { get; set; }
    }
}