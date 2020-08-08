using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessTrackerApi.Models
{
    public class Food
    {
        public int ID { get; set; }

        public string UserID { get; set; }

        public virtual User User { get; set; }

        public string Name { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Calories { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Protein { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Carbohydrates { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Fat { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal Sugar { get; set; }

        public bool IsAlcoholic { get; set; }

        public bool IsPublic { get; set; }
    }
}