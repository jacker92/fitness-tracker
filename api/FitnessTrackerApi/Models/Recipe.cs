using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class Recipe
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("servings")]
        public int Servings { get; set; }

        [JsonPropertyName("isPublic")]
        public bool IsPublic { get; set; }

        [JsonPropertyName("ingredients")]
        public List<RecipeFood> Ingredients { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("calories")]
        public decimal Calories { get; set; } = 0.0M;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("protein")]
        public decimal Protein { get; set; } = 0.0M;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("carbohydrates")]
        public decimal Carbohydrates { get; set; } = 0.0M;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("fat")]
        public decimal Fat { get; set; } = 0.0M;

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("sugar")]
        public decimal Sugar { get; set; } = 0.0M;

        [JsonPropertyName("isAlcoholic")]
        public bool IsAlcoholic { get; set; } = false;
    }
}