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