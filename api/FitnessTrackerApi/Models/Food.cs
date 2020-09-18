using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models
{
    public class Food
    {
        [JsonPropertyName("id")]
        public int ID { get; set; }

        [JsonPropertyName("userId")]
        public string UserID { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("calories")]
        public decimal Calories { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("protein")]
        public decimal Protein { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("carbohydrates")]
        public decimal Carbohydrates { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("fat")]
        public decimal Fat { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        [JsonPropertyName("sugar")]
        public decimal Sugar { get; set; }

        [JsonPropertyName("isAlcoholic")]
        public bool IsAlcoholic { get; set; }

        [JsonPropertyName("isPublic")]
        public bool IsPublic { get; set; }
    }
}