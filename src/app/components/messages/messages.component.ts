import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { MyAuthService } from 'src/app/Services/my-auth.service';
import { map } from 'rxjs/operators';
import { FollowService } from 'src/app/Services/follow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatsService } from 'src/app/Services/chats.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  UserIdListToDisplay$: Observable<string[]>;
  ParamUserId: string;

  Subscriptions: Subscription[] = [];

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
    public router: Router,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.UpdateUsersList()
  }

  ngOnDestroy(): void {
    this.Subscriptions.forEach(sub => {
      sub.unsubscribe()
    })
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
        this.Subscriptions.push(this.activatedRoute.paramMap.subscribe(snap => {
          // console.log(snap)
          const param = snap.get('UserId')
          if (!param)
            this.MyAuth.NavTo(`Messages/${Combined[0]}`)
        }))
        return Combined;
      }))
  }
}
