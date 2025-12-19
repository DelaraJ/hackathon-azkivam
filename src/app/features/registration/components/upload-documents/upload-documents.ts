import {Component} from '@angular/core';
import {FileUploaderComponent} from '../shared/file-uploader/file-uploader';

@Component({
  selector: 'app-upload-documents',
  imports: [
    FileUploaderComponent
  ],
  templateUrl: './upload-documents.html',
  styleUrl: './upload-documents.scss',
})
export class UploadDocuments {

  onFileSelected(file: File, fileName: string) {
    if (fileName === 'nationalCard') {

    } else {

    }
  }
}
