import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InstaResModel} from '../models/insta.res.model';

@Injectable({
  providedIn: 'root'
})

export class InstagramService {
  constructor(private http: HttpClient) {
  }

  base = 'https://db0bb075738d.ngrok-free.app';

  getData(): Observable<InstaResModel> {
    return this.http.post<InstaResModel>(this.base + '/api/instagram/user', {username: 'digikalacom'})
  }
}
