import { Component, OnInit, Input } from '@angular/core';
import { MyAuthService } from 'src/app/Services/my-auth.service';
import { IUser, IFollow } from 'src/app/Models/i-user';
import { FollowService } from 'src/app/Services/follow.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'element-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  @Input() Who: string;
  @Input() UserId: string;
  UsersToDisplay$: Observable<IFollow[]>;

  constructor(
    public MyAuth: MyAuthService,
    public followSrv: FollowService,
  ) { }

  ngOnInit() {
    console.log(this.Who, ' - ', this.UserId)
    if (this.Who == 'Followers') {
      this.UsersToDisplay$ = this.followSrv.GetAUserFollowers(this.UserId);
    }
    else if (this.Who == 'Following') {
      this.UsersToDisplay$ = this.followSrv.GetAUserFollowing(this.UserId);
    }
  }

}
