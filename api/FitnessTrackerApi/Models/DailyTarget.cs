using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class DailyTarget
    {
        public int ID { get; set; }

        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        public MacroTargetMode MacroTargetMode { get; set; } = MacroTargetMode.Off;

        public bool EnableCalorieTarget { get; set; } = false;

        [Column(TypeName = "decimal(18,4)")]
        public decimal CalorieTarget { get; set; } = 0;

        public bool EnableProteinTarget { get; set; } = false;

        [Column(TypeName = "decimal(18,4)")]
        public decimal ProteinPercentage { get; set; } = 0.35M;

        [Column(TypeName = "decimal(18,4)")]
        public decimal ProteinTarget { get; set; } = 0;

        public bool EnableCarbohydratesTarget { get; set; } = false;

        [Column(TypeName = "decimal(18,4)")]
        public decimal CarbohydratePercentage { get; set; } = 0.35M;

        [Column(TypeName = "decimal(18,4)")]
        public decimal CarbohydratesTarget { get; set; } = 0;

        public bool EnableFatTarget { get; set; } = false;

        [Column(TypeName = "decimal(18,4)")]
        public decimal FatPercentage { get; set; } = 0.3M;

        [Column(TypeName = "decimal(18,4)")]
        public decimal FatTarget { get; set; } = 0;

        public bool EnableActiveMinuteTarget { get; set; } = false;

        public int ActiveMintueTarget { get; set; } = 0;

        public bool EnableCaloriesBurnedTarget { get; set; } = false;

        public int CaloriesBurnedTarget { get; set; } = 0;
    }
}