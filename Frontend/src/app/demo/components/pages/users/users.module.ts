import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { UsersRoutingModule } from './users-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';



@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToolbarModule,
    ToastModule,
    FormsModule,
    RippleModule,
    UsersRoutingModule,
    DropdownModule,
    PasswordModule
  ]
})
export class UsersModule { }
