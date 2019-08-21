import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { MyAuthService } from 'src/app/Services/my-auth.service';
import { map } from 'rxjs/operators';
import { FollowService } from 'src/app/Services/follow.service';
import { Router } from '@angular/router';
import { ChatsService } from 'src/app/Services/chats.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  UserIdListToDisplay$: Observable<string[]>;
  ParamUserId: string;

  IsHandset$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 600px)']).pipe(
    map(r => {
      // console.log(r)
      return !r.matches;
    }));;

  constructor(
    public MyAuth: MyAuthService,
    public FollowSrv: FollowService,
    public ChatSrv: ChatsService,
    public breakpointObserver: BreakpointObserver,
    public router: Router) { }

  ngOnInit() {
    this.UpdateUsersList()
  }

  UpdateUsersList() {
    this.ParamUserId = this.router.url.slice(10)
    this.UserIdListToDisplay$ = combineLatest(
      this.FollowSrv.GetAUserFollowersNFollowingUserIds(this.MyAuth.BasicUserInfo.uid),
      this.ChatSrv.GetUnfollowChatUserIds())
      .pipe(map(r => {
        var Combined = [...new Set(r[1].concat(r[0]))];
        if (this.ParamUserId.length > 25)
          if (!Combined.includes(this.ParamUserId)) {
            Combined.unshift(this.ParamUserId)
          }
        return Combined;
      }))
  }
}
