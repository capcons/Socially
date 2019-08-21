import { NgModule } from '@angular/core';
import { MessagesComponent } from 'src/app/components/messages/messages.component';
import { ChatContainerComponent } from 'src/app/components/messages/chat-container/chat-container.component';
import { ChatListComponent } from 'src/app/components/messages/chat-list/chat-list.component';
import { SharedModule } from '../shared.module';
import { MessagesRoutingModule } from '../FeatureRoutings/messages-routing.module';
import { MatSidenavModule, MatCardModule, MatTabsModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, MatRadioModule, MatDatepickerModule, MatDialogModule, MatMenuModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MaterialModule } from '../Material.module';

@NgModule({
  declarations: [
    MessagesComponent, 
    ChatContainerComponent, 
    ChatListComponent
  ],
  imports: [
    SharedModule,
    MessagesRoutingModule,

    //Material modules
    MaterialModule,
    // MatSidenavModule,
    // MatCardModule,
    // MatMenuModule,
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
export class MessagesModule { }
