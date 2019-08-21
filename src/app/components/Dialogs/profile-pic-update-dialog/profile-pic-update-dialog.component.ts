import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageOptimizationService } from 'src/app/Services/image-optimization.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MyAuthService } from 'src/app/Services/my-auth.service';
import { ImageCompressService } from 'ng2-image-compress';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { IUpdatePicModel } from 'src/app/Models/i-user';

@Component({
  selector: 'app-profile-pic-update-dialog',
  templateUrl: './profile-pic-update-dialog.component.html',
  styleUrls: ['./profile-pic-update-dialog.component.css']
})
export class ProfilePicUpdateDialogComponent implements OnInit {
  file;
  thumbImage;
  UpdatePPForm: FormGroup;
  samplePic;
  showImage = false;
  processingImage: boolean = false;
  processingImageComplete: boolean = false;
  processingUpload: boolean = false;
  uploadPercent: Observable<number>;
  downloadURL: Observable<any>;
  Uploading: boolean = false;
  OutputImage;

  constructor(
    public dialogRef: MatDialogRef<ProfilePicUpdateDialogComponent>,
    public imageOptSrvc: ImageOptimizationService,
    public storage: AngularFireStorage,
    private fb: FormBuilder,
    public MyAuth: MyAuthService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.UpdatePPForm = this.fb.group({
      InputImage: ['', Validators.required],
      ProfileCaption: '',
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onChange(fileInput: any) {
    this.processingImage = true;
    this.file = fileInput.target.files[0];
    //this.UpdatePPForm.value.InputImage = fileInput.target.files[0];
    this.imageOptSrvc.AdjustImageHeightWidth(fileInput.target.files[0], 'ProfilePic').subscribe(optimizeOptions => {
      //console.log(r)
      ImageCompressService.filesToCompressedImageSourceEx(fileInput.target.files, optimizeOptions).then(observableImages => {
        observableImages.subscribe((image) => {
          this.OutputImage = image;
          this.imageOptSrvc.dataURItoBlob(this.OutputImage.compressedImage.imageDataUrl).then(r => {
            //Generating Thumb
            this.file=r;
            console.log('generating thumb');
            this.imageOptSrvc.AdjustImageHeightWidth(fileInput.target.files[0], 'ProfilePicThumb').subscribe(optimizeOptions => {
              ImageCompressService.filesToCompressedImageSourceEx(fileInput.target.files, optimizeOptions).then(observableThumImages => {
                observableThumImages.subscribe(thumb => {
                  console.log('generating thumb complete');
                  this.imageOptSrvc.dataURItoBlob(thumb.compressedImage.imageDataUrl).then(r => {
                    this.thumbImage = r;
                  });
                }).unsubscribe();
              })
            }).unsubscribe();
          }).catch(r => { console.log(r) });
          this.showImage = true;
          this.processingImageComplete = true;
        }, (error) => {
          console.log("Error while converting", error);
        }, () => {

        }).unsubscribe();
      });
    }, e => {
      console.log(e)
    }).unsubscribe();
  }

  OnSubmit() {
    const date = new Date();
    const filePath = this.MyAuth.LoggedUser.Email + '/ProfilePictures/' + moment().format('D-M-YYYY');
    const ThumbPath = this.MyAuth.LoggedUser.Email + '/ProfilePictures/Thumb ' + moment().format('D-M-YYYY');
    const fileRef = this.storage.ref(filePath);
    const ThumbRef = this.storage.ref(ThumbPath);
    const task = this.storage.upload(filePath, this.file, { customMetadata: { caption: this.UpdatePPForm.value.ProfileCaption } });
    const Thumbtask = this.storage.upload(ThumbPath, this.thumbImage, { customMetadata: { ProfilePicThumbFor: filePath } });
    this.Uploading = true;
    // observe percentage changes
    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe((URL) => {
          //console.log(URL);
          ThumbRef.getDownloadURL().subscribe(thumbURL => {
            var model: IUpdatePicModel = { url: URL, ThumbUrl: thumbURL }
            // this.MyAuth.UpdateProfilePic(model).subscribe(r => {
            //   this.MyAuth.LoggedUser.PhotoURL = URL;
            //   // this.MyAuth.LoggedUser.ProfilePicThumbURL = thumbURL;
            //   this.dialogRef.close();
            // });
            //this.dialogRef.close();
          });

        })
      })
    )
      .subscribe()
  }
}

