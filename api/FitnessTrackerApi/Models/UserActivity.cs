using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class UserActivity
    {
        public int ID { get; set; }

        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        public DateTime DateRecorded { get; set; }

        public int MinutesElapsed { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal CaloriesBurned { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Measurement { get; set; }

        public int ActivityID { get; set; }

        public Activity Activity { get; set; }
    }
}