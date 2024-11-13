import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event as EventModel } from '../api/event.model';
import { ClientUser } from '../api/client-user.model';
@Injectable({
  providedIn: 'root'
})
export class Event2Service {
  private apiUrl = 'http://localhost:8089/Events/api/events';

  constructor(private http: HttpClient) {}

  retrieveAllEvent(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`${this.apiUrl}/retrieveAllEvent`);
  }

  addEvent(event: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>(`${this.apiUrl}/addEvent`, event);
  }

  updateEvent(event: EventModel): Observable<EventModel> {
    return this.http.put<EventModel>(`${this.apiUrl}/UpdateEvent`, event);
  }

  removeEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove_event/${eventId}`);
  }

  retrieveEvent(eventId: number): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.apiUrl}/retrieveEvent/${eventId}`);
  }

  addEvents(events: EventModel[]): Observable<EventModel[]> {
    return this.http.post<EventModel[]>(`${this.apiUrl}/addEvents`, events);
  }
  addEventWithCategory(event: EventModel, categoryId: number): Observable<EventModel> {
    return this.http.post<EventModel>(`${this.apiUrl}/addEventWithCategory/${categoryId}`, event);
  }
  getEventParticipants(idEvent: number): Observable<ClientUser[]> {
    return this.http.get<ClientUser[]>(`${this.apiUrl}/${idEvent}/participants`);
  }
}
