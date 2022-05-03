import { subscribeCourse } from './../../+state/app.actions';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AppFacade } from 'src/app/+state/app.facade';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Course } from 'src/app/interfaces/course.interface';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesPage implements OnInit, OnDestroy {

  userId$: Observable<string> = this.appFacade.userId$;
  docId$: Observable<string> = this.appFacade.userDocId$;
  userRole$: Observable<string> = this.appFacade.userRole$;
  courses$: Observable<Course[]> = this.appFacade.courses$;

  courseTaskCount: string[] = [];

  //Create Course Form
  createCourseForm: FormGroup = new FormGroup({
    courseId: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(10),
      Validators.pattern('^[a-zA-Z0-9 ]+$'),
    ]),
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
  private userId: string;
  private docId: string;

  constructor(
    public appFacade: AppFacade,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {
    this.subcriptions.add(
      combineLatest([this.userId$, this.docId$]).subscribe(([userId, docId]) => {
        this.userId = userId;
        this.docId = docId;
      })
    );
}

  ngOnInit() {
  }

  ionViewWillEnter() {
    //Update Page Title
    this.appFacade.updateCurrentPage('Courses');
  }

  getCourseTaskCount(courseId: string) {
    this.appFacade.selectCourseTasksCount(courseId);
  }

  closeModal() {
    this.modalController.dismiss({dismissed: true});
  }

  //subscribe to Course (Student)
  subscribeCourse() {
    this.alertController.create({
      header: 'Subscribe Course',
      message: 'Please enter Course Code.',
      inputs: [
        { name: 'code', type: 'text', label: 'Code' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Add Course', role: 'confirm', handler: x => {
            this.appFacade.subscribeCourse(x.code.toUpperCase(), this.docId, this.userId);
        }}
      ]
    }).then(res => res.present());
  }

  createCourse() {
    const course: Course = {
      courseId: this.createCourseForm.value.courseId.toUpperCase(),
      courseName: this.createCourseForm.value.courseName,
      ownerId: this.userId,
      ownerName: this.createCourseForm.value.ownerName,
      description: this.createCourseForm.value.description,
      link: this.createCourseForm.value.link,
      subscribers: [],
      subCount: 0
    };
    //check Course ID, create Course and bind Course to User
    this.appFacade.checkCourseId(course, this.docId);
  }

  ngOnDestroy(): void {
    this.subcriptions.unsubscribe();
  }
}
