using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FitnessTrackerApi.Models.Responses
{
    public class EditGearResponse : BaseResponse
    {
        [JsonPropertyName("gear")]
        public List<Gear> Gear { get; set; }
    }
}