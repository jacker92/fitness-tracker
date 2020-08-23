using System;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class UserMetric
    {
        public int ID { get; set; }

        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        public int MetricID { get; set; }

        public virtual Metric Metric { get; set; }

        public string Measurement { get; set; }

        public DateTime DateTimeRecorded { get; set; }
    }
}