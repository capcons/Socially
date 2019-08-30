import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MyAuthService } from 'src/app/Services/my-auth.service';
import { map, take, tap } from 'rxjs/operators';
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
  UserIdListToDisplay$: Observable<string[]> = this.ChatSrv.GetActiveChatUsersList();
  ParamUserId: string = this.router.url.slice(10);

  Subscriptions: Subscription[] = [];

  IsHandset$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 600px)']).pipe(
    map(r => {
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

    if (!this.ParamUserId) {
      this.UserIdListToDisplay$.pipe(
        take(1),
        tap(r => {
          this.MyAuth.NavTo(`Messages/${r[0]}`)
        })
      ).subscribe()
    }
  }

  ngOnDestroy(): void {
    this.Subscriptions.forEach(sub => {
      sub.unsubscribe()
    })
  }

  UpdateUsersList() {
    // this.ParamUserId = this.router.url.slice(10)
    this.UserIdListToDisplay$
      .pipe(
        map(Combined => {
          if (this.ParamUserId.length > 25)
            if (!Combined.includes(this.ParamUserId)) {
              Combined.unshift(this.ParamUserId)
            }
          return Combined;
        }))
  }
}
