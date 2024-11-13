import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ClientUser } from 'src/app/demo/api/client-user.model';
import { ClientUserService } from 'src/app/demo/service/client-user.service';
import { Event } from 'src/app/demo/api/event.model';
import { Event2Service } from 'src/app/demo/service/event2.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService]
})
export class UsersComponent implements OnInit {
  userDialog: boolean = false;
  deleteDialog: boolean = false;
  deleteSelectedDialog: boolean = false;
  viewParticipationsDialog: boolean = false;
  users: ClientUser[] = [];
  selectedUsers: ClientUser[] = [];
  user: Partial<ClientUser> = { passwordUser: '' };
  participations: Event[] = [];
  cols: any[] = [];
  submitted: boolean = false;
  roles = [
    { label: 'User', value: 'USER' },
    { label: 'Admin', value: 'ADMIN' }
  ];
  constructor(
    private userService: ClientUserService,
    private messageService: MessageService,
    private eventService: Event2Service
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.cols = [
      { field: 'nomUser', header: 'First Name' },
      { field: 'prenomUser', header: 'Last Name' },
      { field: 'emailUser', header: 'Email' },
      { field: 'roleUser', header: 'Role' }
    ];
  }

  loadUsers() {
    this.userService.retrieveAllUser().subscribe(users => {
      this.users = users;
      console.log(users);
    });
  }

  openNew() {
    this.user = { passwordUser: '' };
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelected() {
    this.deleteSelectedDialog = true;
  }

  editUser(user: ClientUser) {
    this.user = { ...user, passwordUser: '' };
    this.userDialog = true;
  }

  deleteUser(user: ClientUser) {
    this.user = { ...user };
    this.deleteDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteSelectedDialog = false;
    this.selectedUsers.forEach(user => this.userService.removeUser(user.idUser).subscribe());
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Selected Users Deleted' });
    this.selectedUsers = [];
    this.loadUsers();
  }

  confirmDelete() {
    this.userService.removeUser(this.user.idUser!).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted' });
      this.loadUsers();
    });
    this.deleteDialog = false;
  }

  saveUser() {
    this.submitted = true;
    if (this.user.idUser) {
      this.userService.updateUser(this.user as ClientUser).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated' });
        this.loadUsers();
      });
    } else {
      this.userService.addUser(this.user as ClientUser).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created' });
        this.loadUsers();
      });
    }
    this.userDialog = false;
  }

  viewParticipations(user: ClientUser) {
    this.userService.getUserParticipations(user.idUser!).subscribe(events => {
        this.participations = events;
        this.viewParticipationsDialog = true;
    });
}

}
