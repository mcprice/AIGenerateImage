namespace webapi.utilities
{
    public static class HttpClientUtility
    {
        public static async Task DownloadFileAsync(this HttpClient client, Uri uri, string FileName)
        {
            using (var stream = await client.GetStreamAsync(uri))
            {
                using (var fileStream = new FileStream(FileName, FileMode.CreateNew))
                {
                    await stream.CopyToAsync(fileStream);
                }
            }
        }
    }
}
