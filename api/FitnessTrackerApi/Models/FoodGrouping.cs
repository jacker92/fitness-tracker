namespace FitnessTrackerApi.Models
{
    public class FoodGrouping
    {
        public int ID { get; set; }

        public string UserID { get; set; }

        public virtual User User { get; set; }

        public string Name { get; set; }
    }
}