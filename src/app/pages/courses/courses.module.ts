import { CourseTaskDetailsComponent } from './components/course-task-details/course-task-details.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoursesPageRoutingModule } from './courses-routing.module';

import { CoursesPage } from './courses.page';
//eCharts
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CoursesPageRoutingModule,
    NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),
  ],
  declarations: [CoursesPage, CourseDetailsComponent, CourseTaskDetailsComponent],
})
export class CoursesPageModule {}
