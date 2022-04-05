import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  public isLoggedIn = false

  constructor(private _service: AppService) { }

  ngOnInit(): void {
    this.isLoggedIn = this._service.checkCredentials();
    let i = window.location.href.indexOf('code');
    if (!this.isLoggedIn && i != -1) {
      this._service.retrieveToken(window.location.href.substring(i + 5));
    }
  }

  login() {
    window.location.href =
      'https://oauth.pipedrive.com/oauth/authorize?client_id=' + this._service.clientId + '&redirect_uri=' + this._service.redirectUri;
  }

  logout() {
    this._service.logout();
  }

}
