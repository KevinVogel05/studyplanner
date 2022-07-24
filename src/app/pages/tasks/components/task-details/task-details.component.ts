import { TaskFeedbackComponent } from './../task-feedback/task-feedback.component';
import { Feedback } from './../../../../interfaces/feedback.interface';
import { TimeService } from './../../../../services/time.service';
import { PersonalTask } from './../../../../interfaces/personalTask.interface';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AppFacade } from 'src/app/+state/app.facade';
import { Task } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit {

  @Input() task: Task;
  @Input() userDocId: string;
  @Input() userId: string;

  userRole$: Observable<string> = this.appFacade.userRole$;
  userId$: Observable<string> = this.appFacade.userId$;
  timeLeft: string;
  isCompleted: boolean|string[] = false;

  constructor(
    private appFacade: AppFacade,
    private modalController: ModalController,
    private alertController: AlertController,
    private timeService: TimeService,
  ) {
  }

  ngOnInit() {
    this.timeLeft = this.timeService.getTimeLeft(this.task.date);
    if (this.task.active) {
      if (this.task.completed.includes(this.userId)) {
        this.isCompleted = true;
      }
    } else {
      this.isCompleted = this.task.completed;
    }
  }

  closeModal() {
    this.modalController.dismiss({ dismissed: true });
  }

  openFeedback(task: Task, userId: string) {
    this.modalController.create({
      component: TaskFeedbackComponent,
      componentProps: {
        task,
        userId
      }
    }).then(res => res.present());
  }

  openFeedbackAlert() {
    this.alertController.create({
      header: 'Feedback',
      message: 'Please take a few seconds to provide some feedback. (Anonymously)',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Skip', role: 'confirm', handler: x => {
            const feedback: Feedback = {
              userId: this.userId,
              skipped: true,
            };
            this.completeCourseTask(this.userId, feedback);
        }},
        {
          text: 'Give Feedback', role: 'confirm', handler: x => {
            this.openFeedback(this.task, this.userId);
        }}
      ],
    }).then(res => res.present());
  }

  // course Task (Student only)
  completeCourseTask(userId: string, feedback: Feedback) {
    this.appFacade.completeCourseTask(this.task, userId, feedback);
  }
  // personal Task
  completePersonalTask() {
    this.appFacade.completePersonalTask(this.task.docId, this.userDocId);
  }
}
