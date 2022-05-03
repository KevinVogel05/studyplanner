import { selectCurrentPage } from './+state/app.selectors';
import { AppFacade } from './+state/app.facade';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, IonRouterOutlet, MenuController, ModalController, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy{
  public currentPage$: Observable<string> = this.appFacade.currentPage$;
  public navigateBack$: Observable<boolean> = this.appFacade.navigateBack$;
  public alert$: Observable<string> = this.appFacade.alert$;
  public toast$: Observable<string> = this.appFacade.toast$;

  private userCourses$: Observable<{ courseId: string; color: string }[]> = this.appFacade.userCourses$;
  private subcriptions: Subscription = new Subscription();
  private subcriptionsMessages: Subscription = new Subscription();

  constructor(
    private appFacade: AppFacade,
    private location: Location,
    private alertController: AlertController,
    private toastController: ToastController,

  ) {
    this.subcriptionsMessages.add(
      combineLatest([this.alert$, this.toast$]).subscribe(([alert, toast]) => {
        if (alert) {
          this.alertController.create({
            header: 'Error',
            message: alert,
            buttons: [
              {
                text: 'Ok', role: 'confirm', handler: x => {
                  this.appFacade.clearAlert();
              }}
            ]
          }).then(res => res.present());
        }
        if (toast) {
          this.toastController.create({
            message: toast,
            duration: 2000,
            color: 'dark',
          }).then(res => {
            res.present();
            this.appFacade.clearToast();
          });
        }
      })
    );
    this.subcriptions.add(this.userCourses$.subscribe(userCourses => {
      userCourses.map(course => {
        const bgColor = course.color;
        const darkColor = '#000';
        const lightColor = '#fff';
        const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
        const r = parseInt(color.substring(0, 2), 16); // hexToR
        const g = parseInt(color.substring(2, 4), 16); // hexToG
        const b = parseInt(color.substring(4, 6), 16); // hexToB
        const uicolors = [r / 255, g / 255, b / 255];
        const c = uicolors.map((col) => {
          if (col <= 0.03928) {
            return col / 12.92;
          }
          return Math.pow((col + 0.055) / 1.055, 2.4);
        });
        const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
        const fontColor = (L > 0.179) ? darkColor : lightColor;
        const style = document.createElement('style');
        style.innerHTML = '.' + course.courseId + ' { background: ' + course.color + '; color: ' + fontColor + '}';
        document.getElementsByTagName('head')[0].appendChild(style);
      });
    }));
  }

  navigateBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subcriptions.unsubscribe();
    this.subcriptionsMessages.unsubscribe();
  }
}
