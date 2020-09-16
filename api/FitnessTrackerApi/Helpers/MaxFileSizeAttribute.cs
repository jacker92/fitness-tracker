using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

public class MaxFileSizeAttribute : ValidationAttribute
{
    private readonly int _maxFileSize;
    public MaxFileSizeAttribute(int maxFileSize)
    {
        _maxFileSize = maxFileSize;
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var file = value as IFormFile;

        if (file != null)
        {
            if (file.Length > _maxFileSize)
            {
                return new ValidationResult(GetErrorMessage());
            }
        }

        return ValidationResult.Success;
    }

    public string GetErrorMessage()
    {
        int maxFileSizeAsMB = _maxFileSize / 1024000;
        return $"Maximum allowed file size is { maxFileSizeAsMB} MB.";
    }
}