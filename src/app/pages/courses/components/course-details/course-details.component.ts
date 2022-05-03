import { CourseTaskDetailsComponent } from '../course-task-details/course-task-details.component';
import { Task } from './../../../../interfaces/task.interface';
import { Course } from 'src/app/interfaces/course.interface';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { AppFacade } from 'src/app/+state/app.facade';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeService } from 'src/app/services/time.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit, OnDestroy {

  course$: Observable<Course>;

  isModalOpen = false;
  isModalEditCourseOpen = false;

  userId$: Observable<string> = this.appFacade.userId$;
  userDocId$: Observable<string> = this.appFacade.userDocId$;
  userRole$: Observable<string> = this.appFacade.userRole$;
  userCourses$: Observable<{courseId: string; color: string}[]> = this.appFacade.userCourses$;
  tasks$: Observable<{ [date: string]: Task[] }>;

  currentTaskId: string;

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
    active: new FormControl(true),
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
    active: new FormControl(true),
  });
  //edit Course Form
  editCourseForm: FormGroup = new FormGroup({
    courseName: new FormControl('', [
      Validators.required,
    ]),
    description: new FormControl(''),
    link: new FormControl(''),
    ownerName: new FormControl('', [
      Validators.required
    ]),
  });

  private subcriptions: Subscription = new Subscription();
  private course: Course;
  private userId: string;
  private userDocId: string;
  private courseId: string;
  private userCourses: {courseId: string; color: string}[];


  constructor(
    private appFacade: AppFacade,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    public timeService: TimeService,
  ) {
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params.courseId;
    this.course$ = this.appFacade.selectCourse(this.courseId);
    this.tasks$ = this.appFacade.selectSortedCourseTasks(this.courseId);
    this.subcriptions.add(
      combineLatest([this.userDocId$, this.course$, this.userId$, this.userCourses$])
        .subscribe(([userDocId, course, userId, userCourses]) => {
          this.userDocId = userDocId;
          this.course = course;
          this.userId = userId;
          this.userCourses = userCourses;
      })
    );
  }

  ngOnDestroy() {
    this.subcriptions.unsubscribe();
  }

  ionViewWillEnter() {
    this.appFacade.updateNavigateBack(true);
  }

  ionViewDidLeave() {
    this.appFacade.updateNavigateBack(false);
  }

  closeModal() {
    this.modalController.dismiss({ dismissed: true });
    this.isModalOpen = false;
    this.isModalEditCourseOpen = false;
  }

  openCourseTaskDetails(task: Task) {
    const subCount = this.course.subCount;
    this.modalController.create({
      component: CourseTaskDetailsComponent,
      componentProps: {
        task,
        subCount
      }
    }).then(res => res.present());
  }

  createTask() {
    const task: Task = {
      courseId: this.course.courseId,
      title: this.createTaskForm.value.title,
      description: this.createTaskForm.value.description,
      priority: this.createTaskForm.value.priority,
      date: this.createTaskForm.value.date,
      active: this.createTaskForm.value.active,
      completed: [],
      feedback: [],
    };
    this.appFacade.createCourseTask(task);
    this.closeModal();
  }

  //edit course
  editCourse(course: Course) {
    this.isModalEditCourseOpen = true;
    this.editCourseForm = new FormGroup({
    courseName: new FormControl(course.courseName, [
      Validators.required,
    ]),
    description: new FormControl(course.description),
    link: new FormControl(course.link),
    ownerName: new FormControl(course.ownerName, [
      Validators.required
    ]),
  });
  }
  updateCourse() {
    const updatedCourse: Course = {
      courseId: this.course.courseId,
      courseName: this.editCourseForm.value.courseName,
      ownerName: this.editCourseForm.value.ownerName,
      description: this.editCourseForm.value.description,
      link: this.editCourseForm.value.link,
      docId: this.course.docId,
      ownerId: this.course.ownerId,
      subCount: this.course.subCount,
      subscribers: [],
    };
    this.course = updatedCourse;
    this.appFacade.updateCourse(updatedCourse);
    this.closeModal();
  }


  //delete Course
  deleteCourseTask(docId: string) {
    this.appFacade.deleteCourseTask(docId);
  }
  deleteCourseTaskConfirm(docId: string, item) {
    item.close();
    this.alertController.create({
      header: 'Delete Task',
      message: 'Are you sure you want to delete this Task permanently?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Confirm', role: 'confirm', handler: x => {
            this.deleteCourseTask(docId);
        }}
      ]
    }).then(res => res.present());
  }

  //edit Task
  editCourseTask(task: Task, item) {
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
      active: new FormControl(task.active, [
        Validators.required
      ]),
    });
  }
  updateTask() {
    const task: Task = {
      courseId: this.course.courseId,
      title: this.editTaskForm.value.title,
      description: this.editTaskForm.value.description,
      priority: this.editTaskForm.value.priority,
      date: this.editTaskForm.value.date,
      active: this.editTaskForm.value.active,
      docId: this.currentTaskId,
      completed: [],
      feedback: [],
    };
    this.appFacade.updateCourseTask(task);
    this.closeModal();
  }

  //delete Course
  deleteCourse(courseId: string, courseDocId: string, subscribers: string[]) {
    const course = this.userCourses.find(c => c.courseId === courseId);
    this.appFacade.deleteCourse(courseDocId);
    this.appFacade.deleteCourseTasks(courseId);
    this.appFacade.deleteUserCourse(this.userDocId, course);
    subscribers.forEach(s => this.appFacade.unsubscribeCourseUsers(s, courseId));
    this.router.navigate(['/courses']);
  }
  deleteCourseConfirm(courseId: string, courseDocId: string, subscribers: string[]) {
    this.alertController.create({
      header: 'Delete Course',
      message: 'Are you sure you want to delete ' + this.course.courseName + ' permanently?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Confirm', role: 'confirm', handler: x => {
            this.deleteCourse(courseId, courseDocId, subscribers);
        }}
      ]
    }).then(res => res.present());
  }

  //unsubscribe Course
  unsubscribeCourse(courseId: string, courseDocId: string) {
    const course = this.userCourses.find(c => c.courseId === courseId);
    this.appFacade.deleteUserCourse(this.userDocId, course);
    this.appFacade.deleteCourseSuccess(courseDocId);
    this.appFacade.deleteCourseTasksSuccess(courseId);
    this.appFacade.decreaseSubCount(courseDocId, this.userId);
    this.router.navigate(['/courses']);
  }
  unsubscribeCourseConfirm(courseId: string, courseDocId: string) {
    this.alertController.create({
      header: 'Unsubscribe Course',
      message: 'Are you sure you want to unsubscribe ' + this.course.courseName + '?',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Confirm', role: 'confirm', handler: x => {
            this.unsubscribeCourse(courseId, courseDocId);
        }}
      ]
    }).then(res => res.present());
  }
}
