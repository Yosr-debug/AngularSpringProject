import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ClientUser } from '../api/client-user.model';
import { Event } from 'src/app/demo/api/event.model';
@Injectable({
  providedIn: 'root'
})
export class ClientUserService {
  private apiUrl = 'http://localhost:8089/Events/api/users';

  constructor(private http: HttpClient) {}

  retrieveAllUser(): Observable<ClientUser[]> {
    return this.http.get<ClientUser[]>(`${this.apiUrl}/retrieveAllUser`);
  }

  addUser(user: ClientUser): Observable<ClientUser> {
    return this.http.post<ClientUser>(`${this.apiUrl}/addUser`, user);
  }

  updateUser(user: ClientUser): Observable<ClientUser> {
    return this.http.put<ClientUser>(`${this.apiUrl}/UpdateUser`, user);
  }

  removeUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove_user/${userId}`);
  }

  retrieveUser(userId: number): Observable<ClientUser> {
    return this.http.get<ClientUser>(`${this.apiUrl}/retrieveUser/${userId}`);
  }

  addUsers(users: ClientUser[]): Observable<ClientUser[]> {
    return this.http.post<ClientUser[]>(`${this.apiUrl}/addUsers`, users);
  }

  participerEvent(idEvent: number): Observable<ClientUser> {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return this.http.put<ClientUser>(`${this.apiUrl}/participer/${userId}/${idEvent}`, {});
    } else {
      throw new Error('User is not logged in');
    }
  }
  login(emailUser: string, passwordUser: string): Observable<any> {
    const credentials = { emailUser, passwordUser };
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.idUser) {
          localStorage.setItem('userId', response.idUser);
        }
      })
    );
  }

  signup(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }
  getUserParticipations(idUser: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/${idUser}/participations`);
}
}
