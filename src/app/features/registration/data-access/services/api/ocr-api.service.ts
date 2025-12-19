import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OcrApiService {
  private httpClient=inject(HttpClient);

  // postOCR():Observable<any>{
  //
  // }


}
