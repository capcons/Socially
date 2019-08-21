import { NgModule } from '@angular/core';
import { PeopleComponent } from 'src/app/components/people/people.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { UserProfileComponent } from 'src/app/components/customElements/user-profile/user-profile.component';
import { AboutUserComponent } from 'src/app/components/customElements/about-user/about-user.component';
import { SharedModule } from '../shared.module';
import { AppDialogsModule } from '../app-dialogs.module';
import { UserProfileRoutingModule } from '../FeatureRoutings/user-profile-routing.module';
import { MatCardModule, MatTabsModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, MatRadioModule, MatDatepickerModule, MatDialogModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FriendsComponent } from 'src/app/components/customElements/friends/friends.component';
import { MaterialModule } from '../Material.module';

@NgModule({
  declarations: [
    ProfileComponent,
    UserProfileComponent,
    AboutUserComponent,
    PeopleComponent,
    FriendsComponent
  ],
  imports: [
    SharedModule,
    AppDialogsModule,
    UserProfileRoutingModule,

    //Material modules
    MaterialModule,
    // MatCardModule,
    // MatTabsModule,
    // MatFormFieldModule,
    // MatOptionModule,
    // MatSelectModule,
    // MatInputModule,
    // MatIconModule,
    // MatButtonModule,
    // MatRadioModule,
    // MatMomentDateModule,
    // MatDatepickerModule,
    // MatDialogModule,
  ]
})
export class UserProfileModule { }
