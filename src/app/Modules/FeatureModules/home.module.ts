import { NgModule } from '@angular/core';
import { HomeComponent } from 'src/app/components/home/home/home.component';
import { SharedModule } from '../shared.module';
import { AppDialogsModule } from '../app-dialogs.module';
import { HomeRoutingModule } from '../FeatureRoutings/home-routing.module';
import { MatCardModule } from '@angular/material';
import { MaterialModule } from '../Material.module';
import { SearchComponent } from 'src/app/components/search/search.component';

@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent
  ],
  imports: [
    SharedModule,
    AppDialogsModule,
    HomeRoutingModule,

    // Material Modules
    MaterialModule,
    // MatCardModule,
  ]
})
export class HomeModule { }
