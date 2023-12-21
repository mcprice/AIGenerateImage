import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'ai-generate-image',
  templateUrl: './ai-generate-image.component.html',
  styleUrls: ['./ai-generate-image.component.css']
})
export class AiGenerateImageComponent {
  public generatedImages?: AIGenerateImage[];
  public showLoadingArea: boolean = false;
  constructor(private http: HttpClient, private _FileSaverService: FileSaverService) { }

  title = 'AI Generate Image';

  getImages(promptText: string) {
    if (!promptText) {
      return;
    }

    this.showLoadingArea = true;

    // Add safe, URL encoded search parameter if the prompt has been typed in.
    const options = promptText ? { params: new HttpParams().set('promptText', promptText) } : {};

    this.http.get<AIGenerateImage[]>('/aigenerateimage', options).subscribe(result => {
      this.generatedImages = result;
      this.showLoadingArea = false;
    }, error => {
      console.error(error);
      this.showLoadingArea = false;
    });
  }

  downloadImage(imageUrl: string, fileName: string) {
    if (!imageUrl) {
      return;
    }

    this.http.get(imageUrl, {
      headers: { "Access-Control-Allow-Origin": imageUrl },
      responseType: 'blob' // This must be a Blob type
    }).subscribe(res => {
      this._FileSaverService.save((<any>res)._body, fileName);
    });

  }
}

interface AIGenerateImage {
  url: string;
  fileName: string;
}
