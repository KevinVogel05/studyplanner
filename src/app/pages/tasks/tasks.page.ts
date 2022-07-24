import { Priority } from './../../enums/priority.enum';
import { TimeService } from './../../services/time.service';
import { PersonalTask } from './../../interfaces/personalTask.interface';
import { Task } from './../../interfaces/task.interface';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppFacade } from 'src/app/+state/app.facade';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskDetailsComponent } from './components/task-details/task-details.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPage {
  // (Task | PersonalTask)[]
  sortedTasks$: Observable<{ [date: string]: any[] }> = this.appFacade.sortedTasks$;

  isModalOpen = false;

  userId$: Observable<string> = this.appFacade.userId$;
  userDocId$: Observable<string> = this.appFacade.userDocId$;
  tasks$: Observable<PersonalTask[]>;

  currentTaskId: string;

  priorityOne: Priority = Priority.Important;
  priorityTwo: Priority = Priority.Normal;
  priorityThree: Priority = Priority.Optional;

  //Task Form
  createTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
    ]),
    priority: new FormControl('', [
      Validators.required,
    ]),
    date: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
  });
  editTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
    ]),
    priority: new FormControl('', [
      Validators.required,
    ]),
    date: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
  });

  private subcriptions: Subscription = new Subscription();
  private userId: string;
  private userDocId: string;
  private filterOne = 'allFirst';
  private filterTwo = 'allSecond';

  constructor(
    private appFacade: AppFacade,
    private modalController: ModalController,
    private alertController: AlertController,
    public timeService: TimeService,
  ) {
    this.subcriptions.add(
      combineLatest([this.userDocId$, this.userId$]).subscribe(([docId, userId]) => {
        this.userDocId = docId;
        this.userId = userId;
      })
    );
  }

  ionViewWillEnter() {
    //Update Page Title
    this.appFacade.updateCurrentPage('Tasks');
  }

  filterChanged(event) {
    switch (event.detail.value) {
      case 'allFirst': {
        this.filterOne = 'allFirst';
        break;
      }
      case 'open': {
        this.filterOne = 'open';
        break;
      }
      case 'completed': {
        this.filterOne = 'completed';
        break;
      }
      case 'allSecond': {
        this.filterTwo = 'allSecond';
        break;
      }
      case 'courses': {
        this.filterTwo = 'courses';
        break;
      }
      case 'personal': {
        this.filterTwo = 'personal';
        break;
      }
    }
    this.appFacade.updateTaskFilter([this.filterOne, this.filterTwo]);
  }

  openTaskDetails(task: (Task | PersonalTask)) {
    const userDocId = this.userDocId;
    const userId = this.userId;
    this.modalController.create({
      component: TaskDetailsComponent,
      componentProps: {
        task,
        userDocId,
        userId
      }
    }).then(res => res.present());
  }

  createTask() {
    const task: PersonalTask = {
      title: this.createTaskForm.value.title,
      description: this.createTaskForm.value.description,
      priority: this.createTaskForm.value.priority,
      date: this.createTaskForm.value.date,
      completed: false
    };
    this.appFacade.createPersonalTask(task, this.userDocId);
    this.closeModal();
  }

  deletePersonalTask(docId: string) {
    this.appFacade.deletePersonalTask(docId, this.userDocId);
  }

  //delete Personal task
  deletePersonalTaskConfirm(docId: string, item) {
    item.close();
    this.alertController.create({
      header: 'Delete Task',
      message: 'Are you sure you want to delete this Task permanently?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Confirm', role: 'confirm', handler: x => {
            this.deletePersonalTask(docId);
        }}
      ]
    }).then(res => res.present());
  }

  editPersonalTask(task: (Task|PersonalTask), item) {
    this.isModalOpen = true;
    item.close();
    this.currentTaskId = task.docId;
    //Task Form prefilled
    this.editTaskForm = new FormGroup({
      title: new FormControl(task.title, [
        Validators.required,
      ]),
      priority: new FormControl(task.priority, [
        Validators.required,
      ]),
      date: new FormControl(task.date, [
        Validators.required
      ]),
      description: new FormControl(task.description, [
        Validators.required
      ]),
    });
  }

  updatePersonalTask() {
    const task: PersonalTask = {
      title: this.editTaskForm.value.title,
      description: this.editTaskForm.value.description,
      priority: this.editTaskForm.value.priority,
      date: this.editTaskForm.value.date,
      docId: this.currentTaskId,
      completed: false
    };
    this.appFacade.updatePersonalTask(task, this.userDocId);
    this.closeModal();
  }

  closeModal() {
    this.modalController.dismiss({dismissed: true});
  }
}
