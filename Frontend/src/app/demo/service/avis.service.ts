import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avis } from '../api/avis.model';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private apiUrl = 'http://localhost:8089/Events/api/avis';

  constructor(private http: HttpClient) {}

  retrieveAllAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/retrieveAllAvis`);
  }

  addAvis(avis: Avis): Observable<Avis> {
    return this.http.post<Avis>(`${this.apiUrl}/addAvis`, avis);
  }

  updateAvis(avis: Avis): Observable<Avis> {
    return this.http.put<Avis>(`${this.apiUrl}/UpdateAvis`, avis);
  }

  removeAvis(avisId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove_avis/${avisId}`);
  }

  retrieveAvis(avisId: number): Observable<Avis> {
    return this.http.get<Avis>(`${this.apiUrl}/retrieveAvis/${avisId}`);
  }

  retrieveAvisByEvent(eventId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/retrieveAvisByEvent/${eventId}`);
  }

  addAvis2(eventId: number, note: number, commentaire?: string): Observable<Avis> {
    const params = new HttpParams()
      .set('eventId', eventId.toString())
      .set('note', note.toString())
      .set('commentaire', commentaire || '');
    return this.http.post<Avis>(`${this.apiUrl}/add`, params);
  }

  affecterAvisAEvent(idUser: number, idEvent: number, commentaire: string, note: number): Observable<Avis> {
    return this.http.put<Avis>(`${this.apiUrl}/donner/${idUser}/${idEvent}/${commentaire}/${note}`, {});
  }
}
