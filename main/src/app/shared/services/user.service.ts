import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {
  }

  sendEmailRecover(email): Observable<any> {
    const link = this.API + '/recover/' + email.email;
    return this.http.get(link);
  }

  sendCodeRecover(email): Observable<any> {
    const link = this.API + '/recover/' + email.email + '/' + email.code;
    return this.http.get(link);
  }

  sendInfoRecover(user): Observable<any> {
    const link = this.API + '/recover';
    return this.http.post(link, user);
  }
}
