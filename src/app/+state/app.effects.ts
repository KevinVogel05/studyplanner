import { PersonalTask } from './../interfaces/personalTask.interface';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { concatMap } from 'rxjs/operators';
import { Observable, EMPTY, from, of } from 'rxjs';
import { map, exhaustMap, switchMap, expand, catchError, mergeMap } from 'rxjs/operators';
import * as AppActions from './app.actions';
import { User } from '../interfaces/user.interface';
import { AppFacade } from './app.facade';
import { Course } from '../interfaces/course.interface';
import { Task } from '../interfaces/task.interface';
import { ModalController } from '@ionic/angular';
import { increment } from 'firebase/firestore';

@Injectable()
export class AppEffects {

  //register with email & password
  registerWithEmailAndPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.register),
      mergeMap((payload) => {
        const user$ = from(this.fireAuth.createUserWithEmailAndPassword(payload.cred.email, payload.cred.password)).pipe(
          map((data) => {
            if (data.user.email) {
              const registerdUser: User = { id: data.user.uid, email: data.user.email, role: payload.cred.role, courses: [] };
              return AppActions.registerSuccess({
                user: registerdUser
              });
            }
            return AppActions.registerFailed({message: 'Failed to Register User.'});
          }),
          catchError(() => of(AppActions.registerFailed({ message: 'Failed to Register User.'})))
        );
        return user$;
      })
    )
  );

  //create role entry for newly registerd User
  createUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.registerSuccess),
      mergeMap((payload) => {
        const role$ = from(this.fireStore.collection('users').add({ userId: payload.user.id, role: payload.user.role, courses: [] })).pipe(
          map(() => AppActions.createUserRoleSuccess()),
          catchError(() => of(AppActions.createUserRoleFailed({message: 'Failed to set user role.'})))
        );
        return role$;
      })
    )
  );

  //change password
  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.changePassword),
      mergeMap((payload) => {
        const user$ = from(this.fireAuth.signInWithEmailAndPassword(payload.cred.email, payload.cred.password)).pipe(
          mergeMap((data) => {
            if (data.user) {
              const user = data.user;
              const pw$ = from(user.updatePassword(payload.newPassword)).pipe(
                map(() => AppActions.changePasswordSuccess({ message: 'Password was successfully changed.' })),
                catchError(() => of(AppActions.changePasswordFailed({
                  message: 'Failed to update Password.'
                })))
              );
              return pw$;
            }
          }),
          catchError(() => of(AppActions.changePasswordFailed({
            message: 'Failed to update Password. Please make sure you enterd the right Password.'
          })))
        );
        return user$;
      })
    )
  );

  //delete user Auth
  deleteUserAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteUserAuth),
      mergeMap((payload) => {
        const user$ = from(this.fireAuth.signInWithEmailAndPassword(payload.cred.email, payload.cred.password)).pipe(
          mergeMap((data) => {
            if (data.user) {
              const user = data.user;
              const del$ = from(user.delete()).pipe(
                map(() => AppActions.deleteUserAuthSuccess({ userDocId: payload.userDocId })),
                catchError(() => of(AppActions.deleteUserAuthFailed({ message: 'Failed to delete Account.' })))
              );
              return del$;
            }
          }),
          catchError(() => of(AppActions.deleteUserAuthFailed({
            message: 'Failed to delete Account. Please make sure you enterd the right Credentials.'
          })))
        );
        return user$;
      })
    )
  );

  //delete user
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteUserAuthSuccess),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('users').doc(payload.userDocId).delete()).pipe(
          map(() => {
            this.router.navigate(['/login']);
            return AppActions.deleteUserSuccess();
          }),
          catchError(() => of(AppActions.deleteUserFailed({ message: 'Failed to delete User.' })))
        );
        return user$;
      })
    )
  );

  //unsubscribe all Subscribed Students (Professor Deletes Account)
  unsubscribeAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.unsubscribeCourses),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('users', ref => ref.where('userId', '==', payload.userId)).get()).pipe(
          mergeMap((data) => {
            if (data) {
              const loadedDoc: Record<string, any> = data.docs[0].data();
              const loadedDocId: string = data.docs[0].id;
              const newCourses = [];
              loadedDoc.courses.forEach(c => {
              if (payload.courseId.find(d => d === c.courseId)) {} else {
                newCourses.push(c);
              }});
              const del$ = from(this.fireStore.collection('users').doc(loadedDocId).update(
                { courses: newCourses })).pipe(
                map(() => AppActions.unsubscribeCoursesSuccess()),
                catchError(() => of(AppActions.unsubscribeCoursesFailed({ message: 'Failed to unsubscribe to Course.' })))
              );
              return del$;
            }
          }),
          catchError(() => of(AppActions.unsubscribeCoursesFailed({message: 'Failed to load subscribed User.'})))
        );
        return user$;
      })
    )
  );

  //login with email & password
  loginWithEmailAndPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.login),
      mergeMap((payload) => {
        const user$ = from(this.fireAuth.signInWithEmailAndPassword(payload.cred.email, payload.cred.password)).pipe(
          map((data) => {
            if (data.user) {
              const loadedUser = { id: data.user.uid, email: data.user.email };
              this.router.navigate(['/tasks']);
              this.appFacade.updateCurrentPage('Tasks');
              return AppActions.loginSuccess({
                user: loadedUser
              });
            }
            return AppActions.loginFailed({
              message: 'Login failed. Please make sure you enterd the right password and email.'
            });
          }),
          catchError(() => of(AppActions.loginFailed({
            message: 'Login failed. Please make sure you enterd the right password and email.'
          })))
        );
        return user$;
      })
    )
  );

  //---------------------------------------Load Data
  //load user
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loginSuccess),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('users', ref => ref.where('userId', '==', payload.user.id)).get()).pipe(
          map((data) => {
            const loadedDoc: Record<string, any> = data.docs[0].data();
            const loadedDocId: string = data.docs[0].id;
            const loadedRole: string = loadedDoc.role;
            const loadedCourses = loadedDoc.courses;
            return AppActions.loadUserDataSuccess({ role: loadedRole, docId: loadedDocId, courses: loadedCourses });
          }),
          catchError(() => of(AppActions.loadUserRoleFailed()))
        );
        return user$;
      })
    )
  );

  //load user courses
  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadUserDataSuccess),
      mergeMap((payload) => {
        const courseId = payload.courses.map(c => c.courseId);
        const courses$ = from(this.fireStore.collection('courses', ref => ref.where('courseId', 'in', courseId)).get()).pipe(
          map((data) => {
            const courses: Course[] = data.docs.map(docs => {
              const courseData: any = docs.data();
              const course: Course = {
                courseId: courseData.courseId,
                courseName: courseData.courseName,
                ownerId: courseData.ownerId,
                ownerName: courseData.ownerName,
                description: courseData.description,
                link: courseData.link,
                subscribers: courseData.subscribers,
                subCount: courseData.subCount,
                docId: docs.id,
              };
              return course;
            });
            return AppActions.loadCoursesSuccess({ courses });
          }),
          catchError(() => of(AppActions.loadCoursesFailed()))
        );
        return courses$;
      })
    )
  );


  //load user course tasks
  loadCourseTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadUserDataSuccess),
      mergeMap((payload) => {
        const courseId = payload.courses.map(c => c.courseId);
        const tasks$ = from(this.fireStore.collection('tasks', ref => ref.where('courseId', 'in', courseId)).get()).pipe(
          map((data) => {
            const tasks: Task[] = data.docs.map(docs => {
              const taskData: any = docs.data();
              const task: Task = {
                courseId: taskData.courseId,
                title: taskData.title,
                priority: taskData.priority,
                date: taskData.date,
                description: taskData.description,
                active: taskData.active,
                completed: taskData.completed,
                feedback: taskData.feedback,
                docId: docs.id,
              };
              return task;
            });
            return AppActions.loadCourseTaskSuccess({ tasks });
          }),
          catchError(() => of(AppActions.loadCourseTaskFailed({ message: 'Course Tasks failed to load.' })))
        );
        return tasks$;
      })
    )
  );

  //load user personal tasks
  loadPersonalTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadUserDataSuccess),
      mergeMap((payload) => {
        const tasks$ = from(this.fireStore.collection('users/' + payload.docId + '/tasks').get()).pipe(
          map((data) => {
            const tasks: PersonalTask[] = data.docs.map(docs => {
              const taskData: any = docs.data();
              const task: PersonalTask = {
                title: taskData.title,
                priority: taskData.priority,
                date: taskData.date,
                description: taskData.description,
                completed: taskData.completed,
                docId: docs.id,
              };
              return task;
            });
            return AppActions.loadPersonalTaskSuccess({ tasks });
          }),
          catchError(() => of(AppActions.loadPersonalTaskFailed({ message: 'Personal Tasks failed to load.' })))
        );
        return tasks$;
      })
    )
  );

  //create personal task
  createPersonalTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createPersonalTask),
      mergeMap((payload) => {
        const task$ = from(this.fireStore.collection('users/' + payload.userDocId + '/tasks').add({
          title: payload.task.title,
          description: payload.task.description,
          priority: payload.task.priority,
          date: payload.task.date,
          completed: payload.task.completed
        })).pipe(
          map((data) => AppActions.createPersonalTaskSuccess({ task: payload.task, docId: data.id })),
          catchError(() => of(AppActions.createPersonalTaskFailed({ message: 'Failed to create Task.' })))
        );
        return task$;
      })
    )
  );
  //update personal task
  updatePersonalTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updatePersonalTask),
      mergeMap((payload) => {
        const task$ = from(this.fireStore.collection('users/' + payload.userDocId + '/tasks').doc(payload.task.docId).update({
          title: payload.task.title,
          description: payload.task.description,
          priority: payload.task.priority,
          date: payload.task.date,
          completed: payload.task.completed
        })).pipe(
          map(() => {
            this.modalController.dismiss({ dismissed: true });
            return AppActions.updatePersonalTaskSuccess({ task: payload.task });
          }),
          catchError(() => of(AppActions.updatePersonalTaskFailed({ message: 'Failed to update Task.' })))
        );
        return task$;
      })
    )
  );
  //complete personal task
  completePersonalTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.completePersonalTask),
      mergeMap((payload) => {
        const task$ = from(this.fireStore.collection('users/' + payload.userDocId + '/tasks').doc(payload.taskDocId).update({
          completed: true
        })).pipe(
          map(() => {
            this.modalController.dismiss({ dismissed: true });
            return AppActions.completePersonalTaskSuccess({ taskDocId: payload.taskDocId });
          }),
          catchError(() => of(AppActions.completePersonalTaskFailed({ message: 'Failed to mark Task as completed.' })))
        );
        return task$;
      })
    )
  );
  //delete personal task
  deletePersonalTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deletePersonalTask),
      mergeMap((payload) => {
        const task$ = from(this.fireStore.collection('users/' + payload.userDocId + '/tasks').doc(payload.docId).delete()).pipe(
          map(() => AppActions.deletePersonalTaskSuccess({ docId: payload.docId })),
          catchError(() => of(AppActions.deletePersonalTaskFailed({ message: 'Failed to delete Task.' })))
        );
        return task$;
      })
    )
  );

  //update courses colors
  updateCourseColors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateCourseColors),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('users').doc(payload.userDocId).update(
          { courses: payload.courses })).pipe(
            map(() => AppActions.updateCourseColorsSuccess({ courses: payload.courses })),
            catchError(() => of(AppActions.updateCourseColorsFailed({ message: 'Failed to update Course Colors.' })))
          );
        return user$;
      })
    )
  );

  //---------------------------------------Student
  //subscribe to course
  subscribeToCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.subscribeCourse),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('users').doc(payload.userDocId).update(
          { courses: arrayUnion({ courseId: payload.courseId, color: '#ffffff' }) })).pipe(
            map(() => AppActions.subscribeCourseSuccess({ courseId: payload.courseId, userId: payload.userId })),
            catchError(() => of(AppActions.subscribeCourseFailed({ message: 'Failed to subscribe to Course.' })))
          );
        return user$;
      })
    )
  );
  //load subscribed course
  loadSubscribedCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.subscribeCourseSuccess),
      mergeMap((payload) => {
        const course$ = from(this.fireStore.collection('courses', ref => ref.where('courseId', '==', payload.courseId)).get()).pipe(
          map((data) => {
            const courseData: any = data.docs[0].data();
            const course: Course = {
              courseId: courseData.courseId,
              courseName: courseData.courseName,
              ownerId: courseData.ownerId,
              ownerName: courseData.ownerName,
              description: courseData.description,
              link: courseData.link,
              subscribers: courseData.subscribers,
              subCount: courseData.subCount,
              docId: data.docs[0].id,
            };
            return AppActions.loadSubscribedCourseSuccess({ course, userId: payload.userId });
          }),
          catchError(() => of(AppActions.loadSubscribedCourseFailed({ message: 'Failed to load subscribed Course.' })))
        );
        return course$;
      })
    )
  );
  //load subscribed course tasks
  loadSubscribedCourseTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.subscribeCourseSuccess),
      mergeMap((payload) => {
        const tasks$ = from(this.fireStore.collection('tasks', ref => ref.where('courseId', '==', payload.courseId)).get()).pipe(
          map((data) => {
            const tasks: Task[] = data.docs.map(docs => {
              const taskData: any = docs.data();
              const task: Task = {
                courseId: taskData.courseId,
                title: taskData.title,
                priority: taskData.priority,
                date: taskData.date,
                description: taskData.description,
                active: taskData.active,
                completed: taskData.completed,
                feedback: taskData.feedback,
                docId: docs.id,
              };
              return task;
            });
            return AppActions.loadSubscribedCourseTaskSuccess({ tasks });
          }),
          catchError(() => of(AppActions.loadSubscribedCourseTaskFailed({ message: 'Subscribed Course Tasks failed to load.' })))
        );
        return tasks$;
      })
    )
  );

  //increase course subCount
  icreaseCourseSubCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadSubscribedCourseSuccess),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('courses').doc(payload.course.docId).update(
          { subCount: increment(1), subscribers: arrayUnion(payload.userId) })).pipe(
            map(() => AppActions.updateSubCountSuccess()),
            catchError(() => of(AppActions.updateSubCountFailed()))
          );
        return user$;
      })
    )
  );

  //decrease course subCount
  decreaseCourseSubCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.decreaseSubCount),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('courses').doc(payload.courseDocId).update(
          { subCount: increment(-1), subscribers: arrayRemove(payload.userId) })).pipe(
            map(() => AppActions.decreaseSubCountSuccess()),
            catchError(() => of(AppActions.decreaseSubCountFailed()))
          );
        return user$;
      })
    )
  );

  //---------------------------------------Professor
  //check if courseId is available
  checkCourseId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.checkCourseId),
      mergeMap((payload) => {
        const course$ = from(this.fireStore.collection(
          'courses', ref => ref.where('courseId', '==', payload.course.courseId)).get({
          })).pipe(
            map((data) => {
              if (data.docs.length >= 1) {
                return AppActions.checkCourseIdInUse({ message: 'This Code is already used. Please try another one.' });
              }
              return AppActions.checkCourseIdFree({ course: payload.course, docId: payload.docId });
            }),
            catchError(() => of(AppActions.checkCourseIdFree({ course: payload.course, docId: payload.docId })))
          );
        return course$;
      })
    )
  );

  //create course
  createCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.checkCourseIdFree),
      mergeMap((payload) => {
        const course$ = from(this.fireStore.collection('courses').add({
          courseId: payload.course.courseId,
          courseName: payload.course.courseName,
          ownerId: payload.course.ownerId,
          ownerName: payload.course.ownerName,
          description: payload.course.description,
          link: payload.course.link,
          subscribers: payload.course.subscribers,
          subCount: payload.course.subCount
        })).pipe(
          map((data) => AppActions.createCourseSuccess({ course: payload.course, docId: data.id, userDocId: payload.docId })),
          catchError(() => of(AppActions.createCourseFailed()))
        );
        return course$;
      })
    )
  );
  //add user with new course
  updateUserCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createCourseSuccess),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('users').doc(payload.userDocId).update(
          { courses: arrayUnion({ courseId: payload.course.courseId, color: '#ffffff' }) })).pipe(
            map(() => {
              this.modalController.dismiss({ dismissed: true });
              return AppActions.updateUserCourseSuccess({
                message: 'Course created. Share the Code' + payload.course.courseId + ' with your Students.'
              });
            }),
            catchError(() => of(AppActions.updateUserCourseFailed()))
          );
        return user$;
      })
    )
  );

  //update course
  updateCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateCourse),
      mergeMap((payload) => {
        const course$ = from(this.fireStore.collection('courses').doc(payload.course.docId).update({
          courseId: payload.course.courseId,
          courseName: payload.course.courseName,
          ownerName: payload.course.ownerName,
          description: payload.course.description,
          link: payload.course.link,
          ownerId: payload.course.ownerId
        })).pipe(
          map(() => {
            this.modalController.dismiss({ dismissed: true });
            return AppActions.updateCourseSuccess({ course: payload.course });
          }),
          catchError(() => of(AppActions.updateCourseFailed({ message: 'Failed to update Course.' })))
        );
        return course$;
      })
    )
  );

  //delete course
  deleteCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteCourse),
      mergeMap((payload) => {
        const course$ = from(this.fireStore.collection('courses').doc(payload.courseDocId).delete()).pipe(
          map(() => AppActions.deleteCourseSuccess({ courseDocId: payload.courseDocId })
          ),
          catchError(() => of(AppActions.deleteCourseFailed({ message: 'Course failed to Delete.' })))
        );
        return course$;
      })
    )
  );
  //delete course entry from user
  deleteUserCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteUserCourse),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('users').doc(payload.userDocId).update(
          { courses: arrayRemove(payload.course) })).pipe(
            map(() => AppActions.deleteUserCourseSuccess({ courseId: payload.course.courseId })),
            catchError(() => of(AppActions.deleteUserCourseFailed({ message: 'Course failed to Delete.' })))
          );
        return user$;
      })
    )
  );
  //delete course entry from user for all subscribers
  unsubscribeCourseUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.unsubscribeCourseUsers),
      mergeMap((payload) => {
        const user$ = from(this.fireStore.collection('users', ref => ref.where('userId', '==', payload.subscriber)).get()).pipe(
          mergeMap((data) => {
            if (data) {
              const loadedDoc: Record<string, any> = data.docs[0].data();
              const loadedDocId: string = data.docs[0].id;
              const newCourses = loadedDoc.courses.filter(c => c.courseId !== payload.courseId);
              const del$ = from(this.fireStore.collection('users').doc(loadedDocId).update(
                { courses: newCourses })).pipe(
                map(() => AppActions.unsubscribeCourseUsersSuccess()),
                catchError(() => of(AppActions.unsubscribeCourseUsersFailed({ message: 'Failed to unsubscribe from Course.' })))
              );
              return del$;
            }
          }),
          catchError(() => of(AppActions.unsubscribeCourseUsersFailed({message: 'Failed to load subscribed User.'})))
        );
        return user$;
      })
    )
  );



  //delete all course tasks
  deleteCourseTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteCourseTasks),
      mergeMap((payload) => {
        const tasks$ = from(this.fireStore.collection('tasks', ref => ref.where('courseId', '==', payload.courseId)).get()).pipe(
          map((data) => {
            data.forEach((doc) => {
              this.fireStore.collection('tasks').doc(doc.id).delete();
            });
            return AppActions.deleteCourseTasksSuccess({ courseId: payload.courseId });
          }),
          catchError(() => of(AppActions.deleteCourseTasksFailed({ message: 'Course Tasks failed to delete.' })))
        );
        return tasks$;
      })
    )
  );

  //create course task
  createCourseTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createCourseTask),
      mergeMap((payload) => {
        const task$ = from(this.fireStore.collection('tasks').add({
          courseId: payload.task.courseId,
          title: payload.task.title,
          description: payload.task.description,
          priority: payload.task.priority,
          date: payload.task.date,
          active: payload.task.active,
          completed: payload.task.completed,
          feedback: payload.task.completed
        })).pipe(
          map((data) => AppActions.createCourseTaskSuccess({ task: payload.task, docId: data.id })),
          catchError(() => of(AppActions.createCourseTaskFailed({ message: 'Failed to create Task.' })))
        );
        return task$;
      })
    )
  );
  //update course task
  updateCourseTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateCourseTask),
      mergeMap((payload) => {
        const task$ = from(this.fireStore.collection('tasks').doc(payload.task.docId).update({
          courseId: payload.task.courseId,
          title: payload.task.title,
          description: payload.task.description,
          priority: payload.task.priority,
          date: payload.task.date,
          active: payload.task.active,
        })).pipe(
          map(() => {
            this.modalController.dismiss({ dismissed: true });
            return AppActions.updateCourseTaskSuccess({ task: payload.task });
          }),
          catchError(() => of(AppActions.updateCourseTaskFailed({ message: 'Failed to update Task.' })))
        );
        return task$;
      })
    )
  );
  //complete course task
  completeCourseTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.completeCourseTask),
      mergeMap((payload) => {
        const task$ = from(this.fireStore.collection('tasks').doc(payload.task.docId).update({
          completed: arrayUnion(payload.userId),
          feedback: arrayUnion(payload.feedback),
        })).pipe(
          map(() => {
            this.modalController.dismiss({ dismissed: true });
            return AppActions.completeCourseTaskSuccess({ task: payload.task, userId: payload.userId });
          }),
          catchError(() => of(AppActions.completeCourseTaskFailed({ message: 'Failed to mark Task as completed.' })))
        );
        return task$;
      })
    )
  );
  //complete course task
  clearCourseTaskStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.clearCourseTaskStats),
      mergeMap((payload) => {
        const task$ = from(this.fireStore.collection('tasks').doc(payload.taskDocId).update({
          completed: [],
          feedback: [],
        })).pipe(
          map(() => AppActions.clearCourseTaskStatsSuccess({ taskDocId: payload.taskDocId })),
          catchError(() => of(AppActions.clearCourseTaskStatsFailed({ message: 'Failed reset Task Statistics.' })))
        );
        return task$;
      })
    )
  );
  //delete course task
  deleteCourseTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteCourseTask),
      mergeMap((payload) => {
        const task$ = from(this.fireStore.collection('tasks').doc(payload.docId).delete()).pipe(
          map(() => AppActions.deleteCourseTaskSuccess({ docId: payload.docId })),
          catchError(() => of(AppActions.deleteCourseTaskFailed({ message: 'Failed to delete Task.' })))
        );
        return task$;
      })
    )
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private fireAuth: AngularFireAuth,
    // private fireData: AngularFireDatabase,
    private fireStore: AngularFirestore,
    private appFacade: AppFacade,
    private modalController: ModalController,
  ) { }
}
