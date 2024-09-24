import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  config = {
    maxFileSize: 50,
    baseUrl: "",
    accessToken : ""
  }

  data = {
    _id: ""
  }
}
