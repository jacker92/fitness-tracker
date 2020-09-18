using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class UpdateDietSettingsRequest
    {
        [Required]
        [JsonPropertyName("manuallyCalculateCalories")]
        public bool ManuallyCalculateCalories { get; set; }

        [Required]
        [JsonPropertyName("macroTargetMode")]
        public MacroTargetMode MacroTargetMode { get; set; }

        [JsonPropertyName("dietMode")]
        public DietMode DietMode { get; set; }

        [JsonPropertyName("dietPercentage")]
        public decimal DietPercentage { get; set; }

        [Required]
        [JsonPropertyName("enableCalorieTarget")]
        public bool EnableCalorieTarget { get; set; }

        [JsonPropertyName("calorieTarget")]
        public decimal CalorieTarget { get; set; }

        [Required]
        [JsonPropertyName("enableProteinTarget")]
        public bool EnableProteinTarget { get; set; }

        [JsonPropertyName("proteinTarget")]
        public decimal ProteinTarget { get; set; }

        [JsonPropertyName("proteinPercentage")]
        public decimal ProteinPercentage { get; set; }

        [Required]
        [JsonPropertyName("enableCarbohydratesTarget")]
        public bool EnableCarbohydratesTarget { get; set; }

        [JsonPropertyName("carbohydratesTarget")]
        public decimal CarbohydratesTarget { get; set; }

        [JsonPropertyName("carbohydratesPercentage")]
        public decimal CarbohydratesPercentage { get; set; }

        [Required]
        [JsonPropertyName("enableFatTarget")]
        public bool EnableFatTarget { get; set; }

        [JsonPropertyName("fatTarget")]
        public decimal FatTarget { get; set; }

        [JsonPropertyName("fatPercentage")]
        public decimal FatPercentage { get; set; }
    }
}