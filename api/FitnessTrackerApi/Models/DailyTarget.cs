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

        [JsonPropertyName("enableColorCoding")]
        public bool EnableColorCoding { get; set; }

        [JsonPropertyName("caloriesYellowStart")]
        public int CaloriesYellowStart { get; set; }

        [JsonPropertyName("caloriesGreenStart")]
        public int CaloriesGreenStart { get; set; }

        [JsonPropertyName("caloriesGreenEnd")]
        public int CaloriesGreenEnd { get; set; }

        [JsonPropertyName("caloriesYellowEnd")]
        public int CaloriesYellowEnd { get; set; }

        [JsonPropertyName("proteinYellowStart")]
        public int ProteinYellowStart { get; set; }

        [JsonPropertyName("proteinGreenStart")]
        public int ProteinGreenStart { get; set; }

        [JsonPropertyName("proteinGreenEnd")]
        public int ProteinGreenEnd { get; set; }

        [JsonPropertyName("proteinYellowEnd")]
        public int ProteinYellowEnd { get; set; }

        [JsonPropertyName("carbohydratesYellowStart")]
        public int CarbohydratesYellowStart { get; set; }

        [JsonPropertyName("carbohydratesGreenStart")]
        public int CarbohydratesGreenStart { get; set; }

        [JsonPropertyName("carbohydratesGreenEnd")]
        public int CarbohydratesGreenEnd { get; set; }

        [JsonPropertyName("carbohydratesYellowEnd")]
        public int CarbohydratesYellowEnd { get; set; }

        [JsonPropertyName("fatYellowStart")]
        public int FatYellowStart { get; set; }

        [JsonPropertyName("fatGreenStart")]
        public int FatGreenStart { get; set; }

        [JsonPropertyName("fatGreenEnd")]
        public int FatGreenEnd { get; set; }

        [JsonPropertyName("fatYellowEnd")]
        public int FatYellowEnd { get; set; }
    }
}