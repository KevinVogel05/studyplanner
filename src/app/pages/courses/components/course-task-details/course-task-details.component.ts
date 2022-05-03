import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { EChartsOption } from 'echarts';
import { Observable } from 'rxjs';
import { AppFacade } from 'src/app/+state/app.facade';
import { Feedback } from 'src/app/interfaces/feedback.interface';
import { Task } from 'src/app/interfaces/task.interface';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-course-task-details',
  templateUrl: './course-task-details.component.html',
  styleUrls: ['./course-task-details.component.scss'],
})
export class CourseTaskDetailsComponent implements OnInit {

  @Input() task: Task;
  @Input() subCount: number;
  timeLeft: string;
  userRole$: Observable<string> = this.appFacade.userRole$;

  public task$: Observable<Task>;
  //Charts
  public completedChart$: Observable<EChartsOption>;
  public feedbackChart$: Observable<EChartsOption>;
  public questionChart$: Observable<EChartsOption>;
  public feedbackMessages$: Observable<string[]>;

  constructor(
    private appFacade: AppFacade,
    private modalController: ModalController,
    private alertController: AlertController,
    private timeService: TimeService,
  ) {
  }

  ngOnInit() {
    this.timeLeft = this.timeService.getTimeLeft(this.task.date);

    this.task$ = this.appFacade.selectCourseTask(this.task.docId);
    this.completedChart$ = this.appFacade.selectChartCompleted(this.task.docId, this.subCount);
    this.feedbackChart$ = this.appFacade.selectChartFeedback(this.task.docId);
    this.questionChart$ = this.appFacade.selectChartQuestions(this.task.docId);
    this.feedbackMessages$ = this.appFacade.selectFeedbackMessages(this.task.docId);
  }

  closeModal() {
    this.modalController.dismiss({ dismissed: true });
  }

  resetStatsAlert() {
    this.alertController.create({
      header: 'Reset Task Statistics',
      message: 'All available Feedback will be removed and this Task will be marked as not completed for all Students.',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Confirm', role: 'confirm', handler: x => {
            this.resetStats();
        }}
      ]
    }).then(res => res.present());
  }
  resetStats() {
    this.appFacade.clearCourseTaskStats(this.task.docId);
  }

}
