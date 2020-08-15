namespace FitnessTrackerApi
{
    public sealed class AppSettings
    {
        public string JwtSecret { get; set; }
        public long MaxAvatarSize { get; set; }
    }
}