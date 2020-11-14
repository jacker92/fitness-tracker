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

        [NotMapped]
        [JsonPropertyName("calories")]
        public decimal Calories
        {
            get
            {
                return Ingredients.Sum(i => i.Calories);
            }
        }

        [NotMapped]
        [JsonPropertyName("protein")]
        public decimal Protein
        {
            get
            {
                return Ingredients.Sum(i => i.Protein);
            }
        }

        [NotMapped]
        [JsonPropertyName("carbohydrates")]
        public decimal Carbohydrates
        {
            get
            {
                return Ingredients.Sum(i => i.Carbohydrates);
            }
        }

        [NotMapped]
        [JsonPropertyName("fat")]
        public decimal Fat
        {
            get
            {
                return Ingredients.Sum(i => i.Fat);
            }
        }

        [NotMapped]
        [JsonPropertyName("sugar")]
        public decimal Sugar
        {
            get
            {
                return Ingredients.Sum(i => i.Sugar);
            }
        }
    }
}