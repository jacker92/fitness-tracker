using FitnessTrackerApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FitnessTrackerApi.Controllers
{
    public class BaseController : ControllerBase
    {
        protected User CurrentUser
        {
            get
            {
                if (HttpContext.Items.ContainsKey("User"))
                {
                    if (HttpContext.Items["User"] != null)
                    {
                        return (User)HttpContext.Items["User"];
                    }
                }

                return null;
            }
        }

        protected static OkObjectResult OkResult(object reponse)
        {
            string json = JsonSerializer.Serialize(reponse);
            return new OkObjectResult(json);
        }

        protected User LoadUser()
        {
            if (HttpContext.Items.ContainsKey("User"))
            {
                if (HttpContext.Items["User"] != null)
                {
                    return (User)HttpContext.Items["User"];
                }
            }

            return null;
        }
    }
}