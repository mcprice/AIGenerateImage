using Microsoft.AspNetCore.Mvc;
using OpenAI.Managers;
using OpenAI;
using OpenAI.ObjectModels.RequestModels;
using OpenAI.ObjectModels;
using System;
using Microsoft.AspNetCore.Cors;
using System.Net;
using System.Net.Http;
using webapi.utilities;

namespace webapi.Controllers;

[ApiController]
[Route("api/aiimage")]
public class AIGenerateImageController : ControllerBase
{
    private readonly ILogger<AIGenerateImageController> _logger;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public AIGenerateImageController(
        ILogger<AIGenerateImageController> logger,
        IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        _webHostEnvironment = webHostEnvironment;
    }

    [Route("generateimage")]
    [HttpGet]
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
                results.Add(new AIGenerateImage { Url = r.Url, FileName = r.Url.Split('?').First().Split('/').Last()});
            }
        }

        return results.ToArray();
    }

    [HttpPost]
    [Route("storeimage")]
    public async Task<StoreImageResult> StoreImageLocally(StoreImageDTO storeImageDTO)
    {
        var results = new StoreImageResult { };

        using (var client = new System.Net.Http.HttpClient()) // WebClient
        {
            var assetsFilePath = Path.Combine(_webHostEnvironment.WebRootPath, "assets");
            
            // TODO: Clear out the folder once in a while, not each request.
            if (Path.Exists(assetsFilePath))
            {
                Directory.Delete(assetsFilePath, true);
            }

            Directory.CreateDirectory(assetsFilePath);

            var filePathAndName = Path.Combine(assetsFilePath, storeImageDTO.fileName);

            var uri = new Uri(storeImageDTO.imageUrl);

            await client.DownloadFileAsync(uri, filePathAndName);

            results.ImagePath = filePathAndName;
            results.ImageFileName = storeImageDTO.fileName;
        }

        return results;
    }
}
