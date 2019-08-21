import { Component, OnInit, Input } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MyAuthService } from 'src/app/Services/my-auth.service';
import { ProfilePicUpdateDialogComponent } from '../../Dialogs/profile-pic-update-dialog/profile-pic-update-dialog.component';
import { IUser } from 'src/app/Models/i-user';


@Component({
  selector: 'app-right-column',
  templateUrl: './right-column.component.html',
  styleUrls: ['./right-column.component.css'],
})
export class RightColumnComponent implements OnInit {
  @Input() iLoggedUser: IUser;

  constructor(
    public MyAuth: MyAuthService,
    public dialog: MatDialog) { }

  openProfilePicUpdateDialog(): void {
    const dialogRef = this.dialog.open(ProfilePicUpdateDialogComponent, {
      //width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  ngOnInit() {
    console.log(this.iLoggedUser)
  }

}
