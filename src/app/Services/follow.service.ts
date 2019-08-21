import { Injectable } from '@angular/core';
import { MyAuthService } from './my-auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable, combineLatest, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap, switchMap } from 'rxjs/operators';
import { IUser, IFollow } from '../Models/i-user';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(
    public MyAuth: MyAuthService,
    public afFunctions: AngularFireFunctions,
    public afStore: AngularFirestore) { }

  FollowAUser(Id: string, DisplayName: string, PhotoURL: string): Observable<any> {
    const FollowAUserFn = this.afFunctions.httpsCallable('FollowAUser')
    const props = { Id, DisplayName, PhotoURL };

    return FollowAUserFn(props)
  }

  UnfollowAUser(UserId: string): Observable<any> {
    const UnfollowAUserFn = this.afFunctions.httpsCallable('UnfollowAUser');

    return UnfollowAUserFn({ UserId })
  }

  GetFollowStatus(UserId: string): Observable<any> {
    return this.afStore.doc(`Follows/${this.MyAuth.LoggedUser.Id}_${UserId}`).valueChanges()
      .pipe(
        map(r => {
          if (r == undefined)
            return 'No'
          else
            return r;
        })
      )
  }

  GetAUserFollowers(UserId: string): Observable<IFollow[]> {
    return this.afStore.collection<IFollow>('Follows', ref =>
      ref.where('SecondUser.Id', '==', UserId)
    ).valueChanges()
  }

  GetAUserFollowing(UserId: string): Observable<IFollow[]> {
    return this.afStore.collection<IFollow>('Follows', ref =>
      ref.where('FirstUser.Id', '==', UserId)
    ).valueChanges()
  }

  GetAUserFollowersNFollowingUserIds(UserId: string): Observable<string[]> {
    return combineLatest(this.GetAUserFollowing(UserId), this.GetAUserFollowers(UserId)).pipe(
      map(res => {
        const combined = res[0].concat(res[1]);
        return combined;
      }),
      switchMap(res => {
        let ret: string[] = [];
        if (res.length)
          res.forEach(e => {
            ret.push(e.FirstUser.Id == this.MyAuth.LoggedUser.Id ? e.SecondUser.Id : e.FirstUser.Id)
          })
        return of(ret)
      })
    )
  }
}
// Code	Meaning
// 0	  Pending
// 1	  Accepted
// 2	  Declined
// 3	  Blocked
