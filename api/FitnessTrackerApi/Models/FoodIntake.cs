using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class FoodIntake
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonPropertyName("foodGroupingId")]
        public int FoodGroupingID { get; set; }

        [JsonPropertyName("foodGrouping")]
        public virtual FoodGrouping FoodGrouping { get; set; }

        [JsonPropertyName("foodId")]
        public int FoodID { get; set; }

        [JsonPropertyName("food")]
        public virtual Food Food { get; set; }

        [JsonPropertyName("recipeId")]
        public int RecipeID { get; set; }

        [JsonPropertyName("recipe")]
        public virtual Recipe Recipe { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("amountEaten")]
        public decimal AmountEaten { get; set; }

        [JsonPropertyName("dateEaten")]
        public DateTime DateEaten { get; set; }
    }
}