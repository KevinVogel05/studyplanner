import { TaskFeedbackComponent } from './components/task-feedback/task-feedback.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';
import { TaskDetailsComponent } from './components/task-details/task-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TasksPageRoutingModule
  ],
  declarations: [TasksPage, TaskDetailsComponent, TaskFeedbackComponent]
})
export class TasksPageModule {}
