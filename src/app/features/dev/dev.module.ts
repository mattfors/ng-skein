import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventFeedComponent } from './event-feed.component/event-feed.component';
import { DevPageComponent } from './dev-page.component';
import { devRoutes } from './dev.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(devRoutes),
    EventFeedComponent,
    DevPageComponent
  ]
})
export class DevModule { }