using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FitnessTrackerApi.Models.Requests
{
    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }

        [Required]
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
