using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTrackerApi.Models
{
    public class FoodIntake
    {
        public int ID { get; set; }

        public string UserID { get; set; }

        public virtual User User { get; set; }

        public int FoodGroupingID { get; set; }

        public virtual FoodGrouping FoodGrouping { get; set; }

        public int FoodID { get; set; }

        public virtual Food Food { get; set; }

        public int RecipeID { get; set; }

        public virtual Recipe Recipe { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal AmountEaten { get; set; }

        public DateTime DateEaten { get; set; }
    }
}