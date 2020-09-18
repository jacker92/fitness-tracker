using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class DailyTarget
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonPropertyName("macroTargetMode")]
        public MacroTargetMode MacroTargetMode { get; set; } = MacroTargetMode.Off;

        [JsonPropertyName("enableCalorieTarget")]
        public bool EnableCalorieTarget { get; set; } = false;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("calorieTarget")]
        public decimal CalorieTarget { get; set; } = 0;

        [JsonPropertyName("enableProteinTarget")]
        public bool EnableProteinTarget { get; set; } = false;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("proteinPercentage")]
        public decimal ProteinPercentage { get; set; } = 35;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("proteinTarget")]
        public decimal ProteinTarget { get; set; } = 0;

        [JsonPropertyName("enableCarbohydratesTarget")]
        public bool EnableCarbohydratesTarget { get; set; } = false;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("carbohydratesPercentage")]
        public decimal CarbohydratesPercentage { get; set; } = 35;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("carbohydratesTarget")]
        public decimal CarbohydratesTarget { get; set; } = 0;

        [JsonPropertyName("enableFatTarget")]
        public bool EnableFatTarget { get; set; } = false;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("fatPercentage")]
        public decimal FatPercentage { get; set; } = 30;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("fatTarget")]
        public decimal FatTarget { get; set; } = 0;

        [JsonPropertyName("enableActiveMinuteTarget")]
        public bool EnableActiveMinuteTarget { get; set; } = false;

        [JsonPropertyName("activeMinuteTarget")]
        public int ActiveMintueTarget { get; set; } = 0;

        [JsonPropertyName("enableCaloriesBurnedTarget")]
        public bool EnableCaloriesBurnedTarget { get; set; } = false;

        [JsonPropertyName("caloriesBurnedTarget")]
        public int CaloriesBurnedTarget { get; set; } = 0;
    }
}