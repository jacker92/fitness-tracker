using System.ComponentModel.DataAnnotations;

namespace FitnessTrackerApi.Models.Requests
{
    public class UpdateDietSettingsRequest
    {
        [Required]
        public bool ManuallyCalculateCalories { get; set; }

        [Required]
        public MacroTargetMode MacroTargetMode { get; set; }

        public DietMode DietMode { get; set; }

        public decimal DietPercentage { get; set; }

        [Required]
        public bool EnableCalorieTarget { get; set; }

        public decimal CalorieTarget { get; set; }

        [Required]
        public bool EnableProteinTarget { get; set; }

        public decimal ProteinTarget { get; set; }

        public decimal ProteinPercentage { get; set; }

        [Required]
        public bool EnableCarbohydratesTarget { get; set; }

        public decimal CarbohydratesTarget { get; set; }

        public decimal CarbohydratesPercentage { get; set; }

        [Required]
        public bool EnableFatTarget { get; set; }

        public decimal FatTarget { get; set; }

        public decimal FatPercentage { get; set; }
    }
}