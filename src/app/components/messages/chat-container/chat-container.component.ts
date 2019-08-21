import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/Models/i-user';
import { IMessage } from '../../../Models/i-message'
import { MyAuthService } from 'src/app/Services/my-auth.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import * as moment from 'moment';
import { ChatsService } from 'src/app/Services/chats.service';
import { ConfirmationDialogComponent } from '../../Dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent implements OnInit {
  User$: Observable<IUser>;
  Messages$: Observable<IMessage[]>;

  User: IUser;
  Messages: IMessage[] = [];

  MessageText: string;
  ParamUserId: string;
  SendingMessage: boolean = false;

  moment = moment;

  DateTimeFormat = {
    sameDay: '[Today] - h:mm a',
    nextDay: '[Tomorrow] - h:mm a',
    nextWeek: 'dddd - h:mm a',
    lastDay: '[Yesterday] - h:mm a',
    lastWeek: '[Last] dddd - h:mm a',
    sameElse: 'ddd, M/D/YY - h:mm a'
  }

  constructor(
    public MyAuth: MyAuthService,
    public Chatsrv: ChatsService,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params.get('UserId'))
      this.ParamUserId = params.get('UserId');
      const ChatRoomId: string = `Room_${this.ParamUserId}_${this.MyAuth.LoggedUser.Id}`;

      this.LoadUser(this.ParamUserId);
      this.LoadMessages(this.ParamUserId);
    })
  }

  LoadUser(UserId: string) {
    this.User$ = this.MyAuth.GetAUserInfoFromStore(UserId)
      .pipe(tap(r => {
        this.User = r;
      }))
  }

  LoadMessages(OfUserId: string) {
    this.Messages$ = this.Chatsrv.LoadMessages(OfUserId).pipe(
      map(docs => {
        console.log(docs)
        return docs.sort((a, b) => {
          return a.SentOn - b.SentOn;
        })
      }),
      tap(r => {
        this.Messages = r;
        this.UpdateMessageStatus(r.filter(e => e.Status == 1 && e.ToId == this.MyAuth.LoggedUser.Id));
      })
    )
  }

  UpdateMessageStatus(Messages: IMessage[]) {
    Messages.forEach(message => {
      console.log("Updating ", message.DocId, ": ", message.Text)
      this.Chatsrv.UpdateMessageStatus(message.DocId, 3).subscribe(r => {
        console.log(r)
      })

    })
  }

  Send(Text: string) {
    this.SendingMessage = true;
    const newMessage: IMessage = {
      FromId: this.MyAuth.LoggedUser.Id,
      DocId: `${Date.now()}`,
      SentOn: Date.now(),
      Status: 0,
      Text: Text,
      ToId: this.ParamUserId,
    }
    this.Messages.push(newMessage)
    this.Chatsrv.SendAMessage(this.ParamUserId, Text).subscribe(r => {
      this.MessageText = '';
      this.SendingMessage = false;
    })
  }

  DeleteAMessage(MessageId: string) {
    const confirmationDialogRef = this.MyAuth.Dialogs.open(ConfirmationDialogComponent, {
      data: {
        MessageId: MessageId,
        Title: 'Delete message',
        Message: 'You are about to delete a message, are you sure?'
      }
    })

    confirmationDialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.Chatsrv.DeleteAMessage(MessageId).subscribe(r => {
          if (r.Code = 202)
            this.MyAuth.Notify.openSnackBar(r.Message, '')
          else
            this.MyAuth.Notify.openSnackBar('Deletion failed, please try again.', '')
        })
      }
    })
  }

  DeleteChat() {

  }
}
