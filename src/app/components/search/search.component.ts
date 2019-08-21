import { Component, OnInit } from '@angular/core';
import { MyAuthService } from 'src/app/Services/my-auth.service';
import { IUser } from 'src/app/Models/i-user';
import { Observable, of } from 'rxjs';
import { IPost } from 'src/app/Models/i-post';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueryFn } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  PeopleResults$: Observable<IUser[]>;
  PeopleResults: IUser[];
  FilteredResults: IUser[];
  QueryForm: FormGroup;

  constructor(
    public MyAuth: MyAuthService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.QueryForm = this.fb.group({
      Query: ['', [Validators.minLength(3), Validators.required]]
    })

    this.PeopleResults$ = this.MyAuth.GetAllUsersFromStore()
      .pipe(tap(r => {
        console.log(r)
        this.PeopleResults = r;
      }))

    this.QueryForm.controls.Query.valueChanges.subscribe((q:string) => {
      console.log(q)
      this.FilteredResults = this.PeopleResults.filter(users => {
        const DisplayName = users.DisplayName.toLowerCase()
        return DisplayName.includes(q.toLowerCase())
      });
      console.log(this.FilteredResults)
    })
  }

  OnSubmit() {
    if (this.QueryForm.valid) {

    }
  }

}
