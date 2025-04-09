import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ScrapingServiceService {
  constructor(private http: HttpClient) {}

  getWatches() {
    return this.http.get<any[]>('http://localhost:3000/api/watches');
  }
  getLots() {
    return this.http.get<any[]>('http://localhost:3000/api/lots');
  }
}
