using Microsoft.AspNetCore.Http;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;

namespace FitnessTrackerApi
{
    public static class Utilities
    {
        public static AppSettings AppSettings;

        public static async Task<byte[]> SaveImage(IFormFile image, string path)
        {
            byte[] imageData;

            using (var memoryStream = new MemoryStream())
            {
                await image.CopyToAsync(memoryStream);

                Bitmap b = (Bitmap)Bitmap.FromStream(memoryStream);

                using (MemoryStream ms = new MemoryStream())
                {
                    b.Save(ms, ImageFormat.Jpeg);

                    imageData = new byte[ms.Length];
                    ms.Read(imageData, 0, (int)ms.Length);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        ms.WriteTo(stream);
                    }
                }
            }

            return imageData;
        }

        public static string ConvertImageToBase64(string path)
        {
            if (!File.Exists(path))
            {
                return "";
            }

            using (Image image = Image.FromFile(path))
            {
                using (MemoryStream m = new MemoryStream())
                {
                    image.Save(m, image.RawFormat);
                    byte[] imageBytes = m.ToArray();

                    // Convert byte[] to Base64 String
                    string base64String = Convert.ToBase64String(imageBytes);
                    return base64String;
                }
            }
        }
    }
}