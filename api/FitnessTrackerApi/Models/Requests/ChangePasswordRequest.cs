using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Requests
{
    public class ChangePasswordRequest
    {
        [Required]
        [JsonPropertyName("currentPassword")]
        public string CurrentPassword { get; set; }

        [Required]
        [JsonPropertyName("newPassword")]
        public string NewPassword { get; set; }

        [Required]
        [JsonPropertyName("confirmNewPassword")]
        public string ConfirmNewPassword { get; set; }

        public ValidationResult Validate()
        {
            if (NewPassword.Length < 8 || !NewPassword.Any(char.IsUpper))
            {
                return new ValidationResult
                {
                    IsValid = false,
                    Message = "Password must be at least 8 characters and contain an upper case letter"
                };
            }

            if (NewPassword != ConfirmNewPassword)
            {
                return new ValidationResult
                {
                    IsValid = false,
                    Message = "Passwords do not match"
                };
            }

            return new ValidationResult
            {
                IsValid = true
            };
        }
    }
}
