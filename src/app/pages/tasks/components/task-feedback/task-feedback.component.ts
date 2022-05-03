import { Feedback } from './../../../../interfaces/feedback.interface';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppFacade } from 'src/app/+state/app.facade';
import { Task } from 'src/app/interfaces/task.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-feedback',
  templateUrl: './task-feedback.component.html',
  styleUrls: ['./task-feedback.component.scss'],
})
export class TaskFeedbackComponent implements OnInit {

  @Input() task: Task;
  @Input() userId: string;

  //Feedback Form
  feedbackForm: FormGroup = new FormGroup({
    learn: new FormControl('neutral'),
    difficulty: new FormControl('neutral'),
    time: new FormControl('neutral'),
    type: new FormControl('neutral'),
    relevance: new FormControl('neutral'),
    message: new FormControl(),
  });

  constructor(
    private appFacade: AppFacade,
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss({ dismissed: true });
  }

  sendFeedback() {
    const feedback: Feedback = {
      userId: this.userId,
      skipped: false,
      learn: this.feedbackForm.value.learn,
      difficulty: this.feedbackForm.value.difficulty,
      time: this.feedbackForm.value.time,
      type: this.feedbackForm.value.type,
      relevance: this.feedbackForm.value.relevance,
      message: this.feedbackForm.value.message,
    };
    console.log('feedback sended', feedback);
    this.closeModal();
    this.appFacade.completeCourseTask(this.task, this.userId, feedback);
  }
}
