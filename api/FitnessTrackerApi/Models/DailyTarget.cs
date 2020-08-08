using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTrackerApi.Models
{
    public class DailyTarget
    {
        public int ID { get; set; }

        public string UserID { get; set; }

        public virtual User User { get; set; }

        public bool EnableCalorieTarget { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal CalorieTarget { get; set; }

        public bool EnableProteinTarget { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal ProteinPercentage { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal ProteinTarget { get; set; }

        public bool EnableCarbohydratesTarget { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal CarbohydratePercentage { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal CarbohydratesTarget { get; set; }

        public bool EnableFatTarget { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal FatPercentage { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal FatTarget { get; set; }

        public bool EnableSugarTarget { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal SugarTarget { get; set; }

        public bool EnableActiveMinuteTarget { get; set; }

        public int ActiveMintueTarget { get; set; }

        public bool EnableCaloriesBurnedTarget { get; set; }

        public int CaloriesBurnedTarget { get; set; }
    }
}