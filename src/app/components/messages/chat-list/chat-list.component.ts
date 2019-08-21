import { Component, OnInit, Input } from '@angular/core';
import { IUser } from 'src/app/Models/i-user';
import { Observable } from 'rxjs';
import { IMessage } from 'src/app/Models/i-message';
import { MyAuthService } from 'src/app/Services/my-auth.service';
import { ChatsService } from 'src/app/Services/chats.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  @Input() UserId: string;
  @Input() IsForHandset: boolean;
  HasUnreadMessages: boolean = false;

  User$: Observable<IUser>;
  LastMessage$: Observable<IMessage>;

  Show: boolean = true;

  constructor(
    public MyAuth: MyAuthService,
    public ChatSrv: ChatsService, ) { }

  ngOnInit() {
    // console.log(this.IsForHandset)
    this.LastMessage$ = this.ChatSrv.GetLastMessage(this.UserId).pipe(
      tap(r => {
        if (r.Status === 1 && r.ToId === this.MyAuth.LoggedUser.Id)
          this.HasUnreadMessages = true;
        else
          this.HasUnreadMessages = false;
      })
    )
    this.User$ = this.MyAuth.GetAUserInfoFromStore(this.UserId).pipe(tap(r => {
      if (!r) {
        this.Show = false;
        this.MyAuth.NavTo('Messages')
      }
    }))
  }

}
