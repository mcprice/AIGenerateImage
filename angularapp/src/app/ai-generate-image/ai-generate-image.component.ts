import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import * as FileSaver from 'file-saver';
import { FileSaverService } from 'ngx-filesaver';
import { Buffer } from 'buffer/';

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

  // Do the API call to generate images based on the prompt the user typed.
  getImages(promptText: string) {
    if (!promptText) {
      return;
    }

    this.showLoadingArea = true;

    // Add safe, URL encoded search parameter if the prompt has been typed in.
    const options = promptText ? { params: new HttpParams().set('promptText', promptText) } : {};

    this.http.get<AIGenerateImage[]>('/api/aiimage/generateimage', options).subscribe(result => {
      this.generatedImages = result;
      this.showLoadingArea = false;
    }, error => {
      console.error(error);
      this.showLoadingArea = false;
    });
  }

  // Trigger the download of the image to the app storage.
  downloadImage(imageUrl: string, fileName: string) {
    if (!imageUrl || !fileName) {
      return;
    }

    const payload = {
      imageUrl: imageUrl,
      fileName: fileName
    }

    this.http.post<StoreImageResult>('/api/aiimage/storeimage', payload).subscribe(result => {
      this.onSave(result);
    }, error => {
      console.error(error);
    });
  }

  onSave(storedImage: StoreImageResult) {

    fetch(`/assets/${storedImage.imageFileName}`)
      .then(response => response.arrayBuffer())
      .then(imageBuffer => {
        const blob = new Blob([Buffer.from(imageBuffer)]); ;
        this._FileSaverService.save(blob, storedImage.imageFileName);
      });
  }
}

interface AIGenerateImage {
  url: string;
  fileName: string;
}

interface StoreImageResult {
  imagePath: string;
  imageFileName: string;
}
