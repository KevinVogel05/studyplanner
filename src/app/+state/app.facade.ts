import { Feedback } from './../interfaces/feedback.interface';
import { PersonalTask } from './../interfaces/personalTask.interface';
import { Task } from './../interfaces/task.interface';
import { Course } from './../interfaces/course.interface';
import { Register } from './../interfaces/register.interface';
import {
  selectCurrentPage,
  selectUserRole,
  selectUserId,
  selectUserDocId,
  selectUserCourses,
  selectCourses,
  selectTasks,
  selectCourseTask,
  selectCourseTasks,
  selectPersonalTasks,
  selectFilteredTasks,
  selectCountCourseTasks,
  selectSortedTasks,
  selectSortedCourseTasks,
  selectCourseTaskDocIds,
  selectChartCompleted,
  selectChartFeedback,
  selectChartQuestions,
  selectFeedbackMessages,
  selectCourse,
  selectNavigateBack,
  selectUser,
  selectCoursesDocIds,
  selectCourseTasksDocIds,
  selectPersonalTasksDocIds,
  selectCourseSubscribers,
  selectAlertMessage,
  selectToastMessage
} from './app.selectors';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { State, AppState } from './app.reducer';
import * as appAction from './app.actions';
import { Credentials } from '../interfaces/credentials.interface';
import { Observable } from 'rxjs';
import { EChartsOption } from 'echarts';

@Injectable()
export class AppFacade {
  //Selectors
  //App
  public currentPage$ = this.store$.select(selectCurrentPage);
  public navigateBack$ = this.store$.select(selectNavigateBack);
  public alert$ = this.store$.select(selectAlertMessage);
  public toast$ = this.store$.select(selectToastMessage);
  //User
  public user$ = this.store$.select(selectUser);
  public userId$ = this.store$.select(selectUserId);
  public userDocId$ = this.store$.select(selectUserDocId);
  public userRole$ = this.store$.select(selectUserRole);
  public userCourses$ = this.store$.select(selectUserCourses);
  //Courses
  public courses$ = this.store$.select(selectCourses);
  public coursesDocId$ = this.store$.select(selectCoursesDocIds);
  public coursesSubs$ = this.store$.select(selectCourseSubscribers);
  //Tasks
  public tasks$ = this.store$.select(selectTasks);
  public courseTaskDocId$ = this.store$.select(selectCourseTasksDocIds);
  public personalTasks$ = this.store$.select(selectPersonalTasks);
  public personalTaskDocId$ = this.store$.select(selectPersonalTasksDocIds);
  public filterdTasks$ = this.store$.select(selectFilteredTasks);
  public sortedTasks$ = this.store$.select(selectSortedTasks);

  constructor(private store$: Store<AppState>) {}

  clearStore(): void {
    this.store$.dispatch(appAction.clearStore());
  }
  login(input: Credentials): void {
    this.store$.dispatch(appAction.login({cred: input}));
  }
  register(input: Register): void {
    this.store$.dispatch(appAction.register({cred: input}));
  }
  changePassword(cred: Credentials, newPassword: string): void {
    this.store$.dispatch(appAction.changePassword({cred, newPassword}));
  }
  deleteUser(cred: Credentials, userDocId: string): void {
    this.store$.dispatch(appAction.deleteUserAuth({cred, userDocId}));
  }
  unsubscribeCourses(userId: string, courseId: string[]): void {
    this.store$.dispatch(appAction.unsubscribeCourses({userId, courseId}));
  }



  updateCurrentPage(input: string): void {
    this.store$.dispatch(appAction.updateCurrentPage({pageName: input}));
  }
  updateNavigateBack(show: boolean): void {
    this.store$.dispatch(appAction.updateNavigateBack({show}));
  }
  clearAlert(): void {
    this.store$.dispatch(appAction.clearAlert());
  }
  clearToast(): void {
    this.store$.dispatch(appAction.clearToast());
  }
  updateCourseColors(userDocId: string, courses: { courseId: string; color: string }[]): void {
    this.store$.dispatch(appAction.updateCourseColors({userDocId, courses}));
  }
  updateTaskFilter(filter: string[]): void {
    this.store$.dispatch(appAction.updateTaskFilter({filter}));
  }
  subscribeCourse(courseId: string, userDocId: string, userId: string): void {
    this.store$.dispatch(appAction.subscribeCourse({courseId, userDocId, userId}));
  }
  decreaseSubCount(courseDocId: string, userId: string): void {
    this.store$.dispatch(appAction.decreaseSubCount({courseDocId, userId}));
  }
  checkCourseId(course: Course, docId: string): void {
    this.store$.dispatch(appAction.checkCourseId({course, docId}));
  }
  createCourseTask(task: Task): void {
    this.store$.dispatch(appAction.createCourseTask({task}));
  }
  createPersonalTask(task: PersonalTask, userDocId: string): void {
    this.store$.dispatch(appAction.createPersonalTask({task, userDocId}));
  }
  updateCourse(course: Course): void {
    this.store$.dispatch(appAction.updateCourse({course}));
  }
  updateCourseTask(task: Task): void {
    this.store$.dispatch(appAction.updateCourseTask({task}));
  }
  updatePersonalTask(task: PersonalTask, userDocId: string): void {
    this.store$.dispatch(appAction.updatePersonalTask({task, userDocId}));
  }
  completeCourseTask(task: Task, userId: string, feedback: Feedback): void {
    this.store$.dispatch(appAction.completeCourseTask({task, userId, feedback}));
  }
  completePersonalTask(taskDocId: string, userDocId: string): void {
    this.store$.dispatch(appAction.completePersonalTask({taskDocId, userDocId}));
  }
  deleteCourseTasks(courseId: string): void {
    this.store$.dispatch(appAction.deleteCourseTasks({courseId}));
  }
  deleteCourseTasksSuccess(courseId: string): void {
    this.store$.dispatch(appAction.deleteCourseTasksSuccess({courseId}));
  }
  deleteCourseTask(docId: string): void {
    this.store$.dispatch(appAction.deleteCourseTask({docId}));
  }
  clearCourseTaskStats(taskDocId: string): void {
    this.store$.dispatch(appAction.clearCourseTaskStats({taskDocId}));
  }
  deletePersonalTask(docId: string, userDocId: string): void {
    this.store$.dispatch(appAction.deletePersonalTask({docId, userDocId}));
  }
  deleteCourse(courseDocId: string): void {
    this.store$.dispatch(appAction.deleteCourse({courseDocId}));
  }
  deleteCourseSuccess(courseDocId: string): void {
    this.store$.dispatch(appAction.deleteCourseSuccess({courseDocId}));
  }
  deleteUserCourse(userDocId: string, course: { courseId: string; color: string }): void {
    this.store$.dispatch(appAction.deleteUserCourse({userDocId, course}));
  }
  unsubscribeCourseUsers(subscriber: string, courseId: string): void {
    this.store$.dispatch(appAction.unsubscribeCourseUsers({subscriber, courseId}));
  }

  //----------------------------------------------Selectors with Parameter
  selectCourse(courseId: string): Observable<Course> {
    return this.store$.select(selectCourse(courseId));
  }
  selectCourseTask(taskDocId: string): Observable<Task> {
    return this.store$.select(selectCourseTask(taskDocId));
  }
  selectCourseTasks(courseId: string): Observable<Task[]> {
    return this.store$.select(selectCourseTasks(courseId));
  }
  selectSortedCourseTasks(courseId: string): Observable<{[date: string]: Task[]}> {
    return this.store$.select(selectSortedCourseTasks(courseId));
  }
  selectCourseTasksDocId(courseId: string): Observable<string[]> {
    return this.store$.select(selectCourseTaskDocIds(courseId));
  }
  selectCourseTasksCount(courseId: string): Observable<string> {
    return this.store$.select(selectCountCourseTasks(courseId));
  }
  selectFeedbackMessages(taskDocId: string): Observable<string[]> {
    return this.store$.select(selectFeedbackMessages(taskDocId));
  }
  //Charts
  selectChartCompleted(taskDocId: string, subCount: number): Observable<EChartsOption> {
    return this.store$.select(selectChartCompleted(taskDocId, subCount));
  }
  selectChartFeedback(taskDocId: string): Observable<EChartsOption> {
    return this.store$.select(selectChartFeedback(taskDocId));
  }
  selectChartQuestions(taskDocId: string): Observable<EChartsOption> {
    return this.store$.select(selectChartQuestions(taskDocId));
  }
}
