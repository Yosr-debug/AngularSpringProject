import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorieevent } from '../api/categorieevent.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieeventService {
  private apiUrl = 'http://localhost:8089/Events/api/categorieevents';

  constructor(private http: HttpClient) {}

  retrieveAllCategorieevent(): Observable<Categorieevent[]> {
    return this.http.get<Categorieevent[]>(`${this.apiUrl}/retrieveAllCategorieevent`);
  }

  addCategorieevent(categorieevent: Categorieevent): Observable<Categorieevent> {
    return this.http.post<Categorieevent>(`${this.apiUrl}/addCategorieevent`, categorieevent);
  }

  updateCategorieevent(categorieevent: Categorieevent): Observable<Categorieevent> {
    return this.http.put<Categorieevent>(`${this.apiUrl}/UpdateCategorieevent`, categorieevent);
  }

  removeCategorieevent(categorieeventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove_categorieevent/${categorieeventId}`);
  }

  retrieveCategorieevent(categorieeventId: number): Observable<Categorieevent> {
    return this.http.get<Categorieevent>(`${this.apiUrl}/retrieveCategorieevent/${categorieeventId}`);
  }
}
