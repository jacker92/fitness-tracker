namespace FitnessTrackerApi
{
    public enum MetricType
    {
        None = 0,
        Distance = 1,
        Weight = 2,
        Numeric = 3,
        Percentage = 4,
        String = 5
    }

    public enum MeasurementSystem
    {
        US = 1,
        Metric = 2
    }

    public enum CaloriesBurnedOffset
    {
        Ignore = 0,
        Balance = 1
    }

    public enum MacroTargetMode
    {
        Off = 0,
        Percentage = 1,
        Manual = 2
    }

    public enum SystemMetrics
    {
        Weight = -1,
        BodyFatPercentage = -2
    }

    public enum ActivityLevel
    {
        Sedentary = 1,
        Light = 2,
        Moderate = 3,
        Very = 4,
        Extremely = 5
    }

    public enum DietMode
    {
        Maintenance = 1,
        Cut = 2,
        Bulk = 3
    }
}