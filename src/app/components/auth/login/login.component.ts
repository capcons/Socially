import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms'
import { MyAuthService } from 'src/app/Services/my-auth.service';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/Models/i-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  User: firebase.UserInfo;
  FormLogin: FormGroup;

  NetworkErrorCount: number = 0;

  hide: boolean = true;
  Loading: boolean = false;

  EmailErrorMessage: string = '';
  PasswordErrorMessage: string = '';

  LoginSub: Subscription;
  FormValueChangesSub: Subscription;

  constructor(
    public MyAuth: MyAuthService,
    private fb: FormBuilder) { }

  ngOnInit() {
    // this.MyAuth.Logout();
    this.FormLogin = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.FormValueChangesSub = this.FormLogin.valueChanges.subscribe(obs => {
      // console.log(obs)
      this.EmailErrorMessage = '';
      this.PasswordErrorMessage = '';
    })
  }

  ngOnDestroy() {
    console.log("ngOnDestroy called")
    try {
      this.LoginSub.unsubscribe()
      this.FormValueChangesSub.unsubscribe()
    }
    catch (err) {
      // console.log(err)
    }
  }

  OnSubmit() {
    this.Loading = true;
    this.Login();
  }

  LoginWith(prov: string) {
    var provider: firebase.auth.AuthProvider;
    if (prov == 'Google')
      provider = new firebase.auth.GoogleAuthProvider;
    else if (prov == 'Facebook')
      provider = new firebase.auth.FacebookAuthProvider;

    this.MyAuth.afAuth.auth.signInWithPopup(provider)
      .then(User => {
        // console.log(User)
        this.MyAuth.BasicUserInfo = User.user;
        this.LoginSub = this.MyAuth.afStore.doc("Users/" + User.user.uid).get().subscribe(u => {
          console.log(u.data())
          const data = u.data();
          if (!data.Email) {
            // this.AdditionalInfoRequired = true;

            const props: IUser = {
              Id:User.user.uid,
              DisplayName: User.user.displayName,
              Email: User.user.email,
              PhotoURL: User.user.photoURL,
              PostsCount: 0,
              FollowersCount: 0,
              FollowingCount: 0,
              Provider: User.user.providerId
            }
            this.MyAuth.afAuth.auth.currentUser.updateProfile({ 'displayName': props.DisplayName, 'photoURL': props.PhotoURL })
            this.MyAuth.afStore.doc("Users/" + User.user.uid).set(props).then(() => {
              this.MyAuth.NavTo('/Home')
              this.Loading = false;
            })
              .catch(err => {
                console.log(err)
              })
            this.MyAuth.Notify.openSnackBar("You've logged in successfully, please tell us something more about you!", "");
          }
          else {
            // this.MyAuth.Notify.openSnackBar("Welcome, " + u.data().DisplayName, "", () => {
            //   this.MyAuth.NavTo('/Home')
            // })
            this.MyAuth.NavTo('/Home')
          }
        })
      })
      .catch(err => {
        console.log(err);
        if (err.code == "auth/network-request-failed") {
          this.NetworkErrorCount++;
          if (this.NetworkErrorCount <= 3) {
            console.log('Retrying: ', this.NetworkErrorCount)
            this.LoginWith(prov);
          }
        }
      })
  }

  Login() {
    const Email = this.FormLogin.value.Email;
    const pwd = this.FormLogin.value.Password;

    this.MyAuth.afAuth.auth.signInWithEmailAndPassword(Email, pwd).then(res => {
      console.log(res)
      if (res.user.uid) {
        // this.MyAuth.Notify.openSnackBar(`Welcome back, ${res.user.displayName}`, '')
        this.Loading = false;
        this.MyAuth.NavTo('Home')
      }
    })
      .catch(err => {
        console.log(err);
        this.Loading = false;
        const errorCode = err.code;
        const errorMessage = err.message;

        switch (errorCode) {
          case 'auth/invalid-email':
            this.EmailErrorMessage = errorMessage;
            break;
          case 'auth/user-disabled':
            this.EmailErrorMessage = errorMessage;
            break;
          case 'auth/user-not-found':
            console.log(errorMessage)
            this.EmailErrorMessage = errorMessage;
            break;
          case 'auth/wrong-password':
            this.PasswordErrorMessage = errorMessage;
            break;

          default:
            this.MyAuth.Notify.openSnackBar('An error occur, please try again later', '')
            break;
        }

        if (err.code == 'auth/network-request-failed')
          this.MyAuth.Notify.openSnackBar('There is problem with network, please check your network connection', '', () => { }, () => { }, 3500)
        else
          this.MyAuth.Notify.openSnackBar(err.message, '')
      })
  }

  // GetLoggedUser(): Observable<IUser> {
  //   return new Observable(observer => {
  //     this.MyAuth.GetLoggedUserInfo()
  //       .subscribe((response => {
  //         if (response) {
  //           console.log(response);
  //           observer.next(response);
  //           observer.complete();
  //         }
  //         else {
  //         }
  //         return response;
  //       }), error => {
  //         observer.error(error);
  //         observer.complete();
  //         console.log("Error getting document:", error);
  //       });
  //   });
  // }

}
