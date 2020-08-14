using Microsoft.AspNetCore.Http;
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
    }
}