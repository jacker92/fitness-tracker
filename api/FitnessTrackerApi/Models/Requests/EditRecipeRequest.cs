using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class EditRecipeRequest
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("servings")]
        public int Servings { get; set; }

        [JsonPropertyName("isPublic")]
        public bool IsPublic { get; set; }

        [JsonPropertyName("ingredients")]
        public List<RecipeFood> Ingredients { get; set; }

        [JsonPropertyName("calories")]
        public decimal Calories { get; set; }

        [JsonPropertyName("protein")]
        public decimal Protein { get; set; }

        [JsonPropertyName("carbohydrates")]
        public decimal Carbohydrates { get; set; }

        [JsonPropertyName("fat")]
        public decimal Fat { get; set; }

        [JsonPropertyName("sugar")]
        public decimal Sugar { get; set; }

        [JsonPropertyName("isAlcoholic")]
        public bool IsAlcoholic { get; set; }
    }
}