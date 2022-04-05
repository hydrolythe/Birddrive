import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public clientId = environment.clientId

  public redirectUri = 'http://localhost:4200/';

  constructor(private _http: HttpClient, private cookieService: CookieService) { }

  retrieveToken(code: any) {
    let params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.clientId);
    params.append('client_secret', environment.clientSecret);
    params.append('redirect_uri', this.redirectUri);
    params.append('code', code);

    let headers =
      new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8' });

    this._http.post('https://oauth.pipedrive.com/oauth/token',
      params.toString(), { headers: headers })
      .subscribe(
        data => this.saveToken(data),
        err => alert('Invalid Credentials'));
  }

  saveToken(token: any) {
    var expireDate = new Date().getTime() + (1000 * token.expires_in);
    this.cookieService.set("access_token", token.access_token, expireDate);
    console.log('Obtained Access token');
    window.location.href = 'http://localhost:4200';
  }

  getResource(resourceUrl: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Bearer ' + this.cookieService.get('access_token')
    });
    return this._http.get(resourceUrl, { headers: headers })
  }

  checkCredentials() {
    return this.cookieService.check('access_token');
  }

  logout() {
    this.cookieService.delete('access_token');
    window.location.reload();
  }
}
