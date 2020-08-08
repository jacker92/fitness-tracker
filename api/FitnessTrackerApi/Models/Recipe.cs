using System.Collections.Generic;

namespace FitnessTrackerApi.Models
{
    public class Recipe
    {
        public int ID { get; set; }

        public string UserID { get; set; }

        public virtual User User { get; set; }

        public string Name { get; set; }

        public int Servings { get; set; }

        public bool IsPublic { get; set; }

        public List<RecipeFood> Ingredients { get; set; }
    }
}