namespace FitnessTrackerApi.Models.Responses
{
    public class AuthenticationResponse : BaseResponse
    {
        public string UserID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }


        public AuthenticationResponse(User user, string token)
        {
            UserID = user.Id;
            Name = user.Name;
            Email = user.Email;
            Token = token;
        }
    }
}