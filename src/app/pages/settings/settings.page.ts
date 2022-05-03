import { Observable, Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { AppFacade } from 'src/app/+state/app.facade';
import { User } from 'src/app/interfaces/user.interface';
import { Course } from 'src/app/interfaces/course.interface';
import { AlertController } from '@ionic/angular';
import { Credentials } from 'src/app/interfaces/credentials.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage implements OnDestroy {

  user$: Observable<User> = this.appFacade.user$;
  courses$: Observable<Course[]> = this.appFacade.courses$;
  coursesDocId$: Observable<string[]> = this.appFacade.coursesDocId$;
  courseTaskDocId$: Observable<string[]> = this.appFacade.courseTaskDocId$;
  personalTaskDocId$: Observable<string[]> = this.appFacade.personalTaskDocId$;

  userDocId$: Observable<string> = this.appFacade.userDocId$;
  coursesNames$: Observable<Course[]> = this.appFacade.courses$;
  coursesC$: Observable<{ courseId: string; color: string }[]> = this.appFacade.userCourses$;
  coursesSubs$: Observable<{ [user: string]: string[] }> = this.appFacade.coursesSubs$;

  coursesC: { courseId: string; color: string; courseName: string }[] = [];
  color: string[] = [];

  private subcriptions: Subscription = new Subscription();

  constructor(private appFacade: AppFacade, private alertController: AlertController) {
    this.subcriptions.add(
      combineLatest([this.coursesC$, this.coursesNames$]).subscribe(([coursesC, courseNames]) => {
        this.color = [];
        if (courseNames.length >= 1) {
          this.coursesC = coursesC.map(c => {
            this.color.push(c.color);
            const cName = courseNames.find(cN => cN.courseId === c.courseId);
            return { courseId: c.courseId, color: c.color, courseName: cName.courseName };
          });
        }
      })
    );
  }

  ngOnDestroy() {
    this.subcriptions.unsubscribe();
  }

  ionViewWillEnter() {
    //Update Page Title
    this.appFacade.updateCurrentPage('Settings');
  }

  changePassword(user: User) {
    this.alertController.create({
      header: 'Change Password',
      message: '',
      inputs: [
        { name: 'cPw', type: 'password', label: 'Current Password', placeholder: 'Current Password' },
        { name: 'nPw', type: 'password', label: 'New Password', placeholder: 'New Password' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Confirm', role: 'confirm', handler: x => {
            this.appFacade.changePassword({email: user.email, password: x.cPw}, x.nPw);
        }}
      ]
    }).then(res => res.present());
  }

  deleteUserStudent(user: User, coursesDocId: string[]) {
    console.log('Delete Student');
    this.alertController.create({
      header: 'Delete Account',
      message: 'Are you sure you want to delete this Account?',
      inputs: [
        { name: 'password', type: 'password', label: 'Password', placeholder: 'Password' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Confirm', role: 'confirm', handler: x => {
            const cred: Credentials = { email: user.email, password: x.password };
            this.appFacade.deleteUser(cred, user.docId);
            coursesDocId.forEach(id => this.appFacade.decreaseSubCount(id, user.id));
        }}
      ]
    }).then(res => res.present());
  }
  deleteUserProfessor(user: User, coursesDocId: string[], courses: Course[], cSubs: {[user: string]: string[]}) {
    console.log('Delete Professor');
    this.alertController.create({
      header: 'Delete Account',
      message: 'Are you sure you want to delete this Account?',
      inputs: [
        { name: 'password', type: 'password', label: 'Password', placeholder: 'Password' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Confirm', role: 'confirm', handler: x => {
            const cred: Credentials = { email: user.email, password: x.password };
            this.appFacade.deleteUser(cred, user.docId);
            //delete user Courses (Prof)
            coursesDocId.forEach(id => this.appFacade.deleteCourse(id));
            //delete user Courses Tasks (Prof)
            const courseIds = user.courses.map(c => c.courseId);
            courseIds.forEach(id => this.appFacade.deleteCourseTasks(id));
            //unsub all students from courses
            console.log('subs:', cSubs);
            if (cSubs) {
              for (const key in cSubs) {
                if (key) {
                  console.log('effect with', key, cSubs[key]);
                  this.appFacade.unsubscribeCourses(key, cSubs[key]);
                }
              }
            }
        }}
      ]
    }).then(res => res.present());
  }

  updateColors(userDocId: string) {
    const coursesUpdate: { courseId: string; color: string }[] = [];
    for (let i = 0; i < this.coursesC.length; i++){
      if (this.color[i]) {
        coursesUpdate.push( { courseId: this.coursesC[i].courseId, color: this.color[i] });
      }
      if (!this.color[i]) {
        coursesUpdate.push( { courseId: this.coursesC[i].courseId, color: this.coursesC[i].color });
      }
    }
    this.appFacade.updateCourseColors(userDocId, coursesUpdate);
  }

}
