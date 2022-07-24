import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { getMessaging, getToken, MessagePayload, NotificationPayload, onMessage } from 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class MessagingService {

  currentMessage: BehaviorSubject<NotificationPayload> = new BehaviorSubject(null);

  constructor() {}

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging,
    { vapidKey: environment.firebase.vapidKey}).then(
      (currentToken) => {
        if (currentToken) {
          console.log('Firebase Token received:');
          console.log(currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }
  receiveMessage() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      const title = payload.notification.title;
      const message = payload.notification.body;

      this.currentMessage.next({title, body: message});
    });
  }


}
