using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FitnessTrackerApi.Controllers
{
    public class BaseController : ControllerBase
    {
        protected static OkObjectResult OkResult(object reponse)
        {
            string json = JsonSerializer.Serialize(reponse);
            return new OkObjectResult(json);
        }
    }
}