using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class RecipeFood
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("recipeId")]
        public int RecipeID { get; set; }

        [JsonPropertyName("foodId")]
        public int FoodID { get; set; }

        [JsonPropertyName("food")]
        public Food Food { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("quantity")]
        public decimal Quantity { get; set; }

        [NotMapped]
        [JsonPropertyName("calories")]
        public decimal Calories
        {
            get
            {
                return Food.Calories * Quantity;
            }
        }

        [NotMapped]
        [JsonPropertyName("protein")]
        public decimal Protein
        {
            get
            {
                return Food.Protein * Quantity;
            }
        }

        [NotMapped]
        [JsonPropertyName("carbohydrates")]
        public decimal Carbohydrates
        {
            get
            {
                return Food.Carbohydrates * Quantity;
            }
        }

        [NotMapped]
        [JsonPropertyName("fat")]
        public decimal Fat
        {
            get
            {
                return Food.Fat * Quantity;
            }
        }

        [NotMapped]
        [JsonPropertyName("sugar")]
        public decimal Sugar
        {
            get
            {
                return Food.Sugar * Quantity;
            }
        }
    }
}