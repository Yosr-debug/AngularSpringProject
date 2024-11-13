import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { ClientUser } from '../demo/api/client-user.model';
import { ClientUserService } from '../demo/service/client-user.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];
    user: ClientUser | null = null; // Store user data

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private userService: ClientUserService,
        private router: Router
    ) {}

    ngOnInit() {
        const userId = localStorage.getItem('userId');
        if (userId) {
            this.userService.retrieveUser(Number(userId)).subscribe(
                (data) => {
                    this.user = data;
                    console.log(this.user)
                },
                (error) => {
                    console.error('Failed to retrieve user data', error);
                }
            );
        }
    }

    logout() {
        localStorage.removeItem('userId');
        this.user = null;
        this.router.navigate(['/auth/login']);
    }
}
