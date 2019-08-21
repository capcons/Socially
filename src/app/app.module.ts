import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireAuthModule } from "@angular/fire/auth";

import { AppRoutingModule } from './app-routing.module';
import { AppDialogsModule } from './Modules/app-dialogs.module'

import { AppComponent } from './app.component';
import { MyAuthService } from './Services/my-auth.service';
import { NotificationService } from './Services/notification.service';
import { AuthGuard } from './guards/auth.guard';
import { UserResolverService } from './Services/user-resolver.service';
import { ImageCompressService, ResizeOptions } from 'ng2-image-compress';
import { ImageOptimizationService } from './Services/image-optimization.service';
import { SharedModule } from './Modules/shared.module';
import { MatButtonModule, MatToolbarModule, MatMenuModule, MatSnackBarModule, MatDialogModule, MatSidenavModule, MatIconModule, MatListModule, MatFormFieldModule, MatProgressBarModule } from '@angular/material';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { LayoutModule } from '@angular/cdk/layout';
import { ConfirmationDialogComponent } from './components/Dialogs/confirmation-dialog/confirmation-dialog.component';
import { ProfilePicUpdateDialogComponent } from './components/Dialogs/profile-pic-update-dialog/profile-pic-update-dialog.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './Modules/Material.module';

@NgModule({
  declarations: [
    AppComponent,
    ProfilePicUpdateDialogComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    // MatButtonModule,
    // MatToolbarModule,
    // MatMenuModule,
    // MatSnackBarModule,
    // MatDialogModule,
    // MatFormFieldModule,
    // MatProgressBarModule,
    // MatSidenavModule,
    // MatIconModule,
    // MatListModule,

    AppDialogsModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(
      {
        apiKey: "AIzaSyC0m-8NJoZUYGl6E3LCJ-5y2oBu0byGMDo",
        authDomain: "socially-62c2c.firebaseapp.com",
        databaseURL: "https://socially-62c2c.firebaseio.com",
        projectId: "socially",
        storageBucket: "socially.appspot.com",
        messagingSenderId: "295137985071",
        appId: "1:295137985071:web:30d3b67eb758db42"
      }
      // OLD - Kachings project
      //   {
      //   apiKey: "AIzaSyDuWvSQv22P_riHV-nwkWXN_pg1o3VRIGg",
      //   authDomain: "kachings-83e4e.firebaseapp.com",
      //   databaseURL: "https://kachings-83e4e.firebaseio.com",
      //   projectId: "kachings-83e4e",
      //   storageBucket: "kachings-83e4e.appspot.com",
      //   messagingSenderId: "355576704221"
      // }
    ),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule, //.enablePersistence(),
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    LayoutModule,
  ],
  providers: [
    MyAuthService,
    NotificationService,
    AuthGuard,
    UserResolverService,
    ImageCompressService,
    ResizeOptions,
    ImageOptimizationService,
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    ProfilePicUpdateDialogComponent,
  ]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }