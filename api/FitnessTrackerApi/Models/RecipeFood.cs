using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTrackerApi.Models
{
    public class RecipeFood
    {
        public int ID { get; set; }

        public int RecipeID { get; set; }

        public int FoodID { get; set; }

        public Food Food { get; set; }


        [Column(TypeName = "decimal(18,4)")]
        public decimal Quantity { get; set; }
    }
}