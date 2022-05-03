import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppFacade } from 'src/app/+state/app.facade';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage implements OnInit {

  constructor(private appFacade: AppFacade) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    //Update Page Title
    this.appFacade.updateCurrentPage('About');
  }

}
