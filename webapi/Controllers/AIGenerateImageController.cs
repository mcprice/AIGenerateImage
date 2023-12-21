using Microsoft.AspNetCore.Mvc;
using OpenAI.Managers;
using OpenAI;
using OpenAI.ObjectModels.RequestModels;
using OpenAI.ObjectModels;
using System;
using Microsoft.AspNetCore.Cors;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class AIGenerateImageController : ControllerBase
{
    private readonly ILogger<AIGenerateImageController> _logger;

    public AIGenerateImageController(ILogger<AIGenerateImageController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetGenerateAIImage")]
    public IEnumerable<AIGenerateImage> Get(string promptText)
    {
        var results = new List<AIGenerateImage>();
        var openAiService = new OpenAIService(new OpenAiOptions()
        {
            ApiKey = Environment.GetEnvironmentVariable("OPEN_AI_API_KEY", EnvironmentVariableTarget.User)
        });

        var imageResult = openAiService.Image.CreateImage(new ImageCreateRequest
        {
            Prompt = promptText,
            N = 1,
            Size = StaticValues.ImageStatics.Size.Size1024,
            ResponseFormat = StaticValues.ImageStatics.ResponseFormat.Url,
            User = "TestUser"
        }).Result;


        if (imageResult.Successful)
        {
            foreach(var r in imageResult.Results)
            {
                results.Add(new AIGenerateImage { Url = r.Url, FileName = r.Url.Split('/').Last()});
            }
        }

        return results.ToArray();
    }
}
