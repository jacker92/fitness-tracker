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
    }
}