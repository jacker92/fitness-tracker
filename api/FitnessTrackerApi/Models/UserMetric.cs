using System;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class UserMetric
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonPropertyName("metricId")]
        public int MetricID { get; set; }

        [JsonIgnore]
        public virtual Metric Metric { get; set; }

        [JsonPropertyName("measurement")]
        public string Measurement { get; set; }

        [JsonPropertyName("dateTimeRecorded")]
        public DateTime DateTimeRecorded { get; set; }

    }
}