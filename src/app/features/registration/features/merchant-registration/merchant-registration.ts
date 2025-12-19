import { Component } from '@angular/core';
import {MatStep, MatStepper} from '@angular/material/stepper';
import {UploadDocuments} from '../../components/upload-documents/upload-documents';

@Component({
  selector: 'merchant-registration',
  imports: [
    MatStepper,
    MatStep,
    UploadDocuments
  ],
  templateUrl: './merchant-registration.html',
  styleUrl: './merchant-registration.scss',
})
export class MerchantRegistration {

}
