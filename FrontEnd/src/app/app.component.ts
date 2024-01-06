import { Component, OnInit } from '@angular/core';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FrontEnd';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {

    this.apiService.getApi().subscribe({
      next: (response: Object) => {
        console.log(response);
      },
      error: (error: any) => {
        console.error(error);
      }});
  }
}
