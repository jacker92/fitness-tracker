namespace FitnessTrackerApi
{
    public enum MetricType
    {
        None = 0,
        Distance = 1,
        Numeric = 2,
        Percentage = 3,
        String = 4,
        Weight = 5
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
}