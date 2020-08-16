using System.ComponentModel.DataAnnotations;

namespace FitnessTrackerApi.Models.Requests
{
    public class UpdateActivitySettingsRequest
    {
        [Required]
        public CaloriesBurnedOffset CaloriesBurnedSetting { get; set; }

        [Required]
        public bool EnableActiveMinuteTarget { get; set; }

        [Required]
        public int ActiveMintueTarget { get; set; }

        [Required]
        public bool EnableCaloriesBurnedTarget { get; set; }

        [Required]
        public int CaloriesBurnedTarget { get; set; }
    }
}