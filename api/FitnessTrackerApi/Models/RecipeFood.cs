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
                if (Food != null)
                {
                    return Food.Calories * Quantity;
                }

                return 0;
            }
        }

        [NotMapped]
        [JsonPropertyName("protein")]
        public decimal Protein
        {
            get
            {
                if (Food != null)
                {
                    return Food.Protein * Quantity;
                }

                return 0;
            }
        }

        [NotMapped]
        [JsonPropertyName("carbohydrates")]
        public decimal Carbohydrates
        {
            get
            {
                if (Food != null)
                {
                    return Food.Carbohydrates * Quantity;
                }

                return 0;
            }
        }

        [NotMapped]
        [JsonPropertyName("fat")]
        public decimal Fat
        {
            get
            {
                if (Food != null)
                {
                    return Food.Fat * Quantity;
                }

                return 0;
            }
        }

        [NotMapped]
        [JsonPropertyName("sugar")]
        public decimal Sugar
        {
            get
            {
                if (Food != null)
                {
                    return Food.Sugar * Quantity;
                }

                return 0;
            }
        }
    }
}