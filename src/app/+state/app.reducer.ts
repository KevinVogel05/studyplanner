import { PersonalTask } from './../interfaces/personalTask.interface';
import { Course } from './../interfaces/course.interface';
import { Action, createReducer, on } from '@ngrx/store';
import * as AppActions from './app.actions';
import { User } from './../interfaces/user.interface';
import { Task } from '../interfaces/task.interface';

export const appFeatureKey = 'AppState';

export interface AppState {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AppState: State;
}

export interface State {
  user: User;
  courses: Course[];
  tasks: Task[];
  personalTasks: PersonalTask[];
  taskFilter: string[];
  currentPage: string;
  navigateBack: boolean;
  alertMessage: string;
  toastMessage: string;
}

export const initialState: State = {
  user: undefined,
  courses: [],
  tasks: [],
  personalTasks: [],
  taskFilter: ['allFirst', 'allSecond'],
  currentPage: 'Login',
  navigateBack: false,
  alertMessage: undefined,
  toastMessage: undefined,
};

export const reducer = createReducer(
  initialState,

  on(AppActions.loadApp, state => state),

  //Login
  on(AppActions.loginSuccess, (state: State, action) => {
    const user: User = action.user;
    const toastMessage = 'Successfully logged in.';
    return { ...state, user, toastMessage };
  }),
  //Load User Role / DocId
  on(AppActions.loadUserDataSuccess, (state: State, action) => {
    const stateUser: User = state.user;
    const update = { role: action.role, docId: action.docId, courses: action.courses  };
    const user: User = { ...stateUser, ...update };
    return { ...state, user };
  }),
  //Load Courses
  on(AppActions.loadCoursesSuccess, (state: State, action) => {
    const courses: Course[] = action.courses;
    return { ...state, courses };
  }),
  //Load Course Tasks
  on(AppActions.loadCourseTaskSuccess, (state: State, action) => {
    const tasks: Task[] = action.tasks;
    return { ...state, tasks };
  }),
  //Load Personal Tasks
  on(AppActions.loadPersonalTaskSuccess, (state: State, action) => {
    const personalTasks: PersonalTask[] = action.tasks;
    return { ...state, personalTasks };
  }),
  //Load Subscribed Course
  on(AppActions.loadSubscribedCourseSuccess, (state: State, action) => {
    const courses: Course[] = [...state.courses, action.course];
    return { ...state, courses};
  }),
  //Load Subscribed Course Tasks
  on(AppActions.loadSubscribedCourseTaskSuccess, (state: State, action) => {
    const tasks: Task[] = [...state.tasks, ...action.tasks];
    return { ...state, tasks };
  }),
  //---------------------------------------------------Updates
  //Update Current Page
  on(AppActions.updateCurrentPage, (state: State, action) => {
    const currentPage: string = action.pageName;
    return { ...state, currentPage };
  }),
  //Update Navigate Back
  on(AppActions.updateNavigateBack, (state: State, action) => {
    const navigateBack: boolean = action.show;
    return { ...state, navigateBack };
  }),
  //Update Task Filter
  on(AppActions.updateTaskFilter, (state: State, action) => {
    const taskFilter: string[] = action.filter;
    return { ...state, taskFilter };
  }),
  //Update Course Colors
  on(AppActions.updateCourseColorsSuccess, (state: State, action) => {
    const user: User = { ...state.user, courses: action.courses };
    return { ...state, user };
  }),
  //Subscribe to Course
  on(AppActions.subscribeCourseSuccess, (state: State, action) => {
    const user: User = { ...state.user };
    user.courses = [...user.courses, { courseId: action.courseId, color: '#ffffff' }];
    return { ...state, user };
  }),
  //Create Course
  on(AppActions.createCourseSuccess, (state: State, action) => {
    const newCourse: Course = { ...action.course, docId: action.userDocId };
    const courses: Course[] = [ ...state.courses, newCourse ];
    const user: User = { ...state.user, courses: [...state.user.courses, { courseId: action.course.courseId, color: '#ffffff' } ] };
    return { ...state, courses, user };
  }),
  //Update Course
  on(AppActions.updateCourseSuccess, (state: State, action) => {
    const filterdCourses: Course[] = state.courses.filter(course => course.docId !== action.course.docId );
    const courses: Course[] = [ ...filterdCourses, action.course ];
    return { ...state, courses };
  }),
  //Create Course Task
  on(AppActions.createCourseTaskSuccess, (state: State, action) => {
    const newTask: Task = { ...action.task, docId: action.docId };
    const tasks: Task[] = [ ...state.tasks, newTask ];
    return { ...state, tasks };
  }),
  //Create Personal Task
  on(AppActions.createPersonalTaskSuccess, (state: State, action) => {
    const newTask: PersonalTask = { ...action.task, docId: action.docId };
    const personalTasks: PersonalTask[] = [ ...state.personalTasks, newTask ];
    return { ...state, personalTasks };
  }),
  //Complete Course Task
  on(AppActions.completeCourseTaskSuccess, (state: State, action) => {
    const filterdTasks: Task[] = state.tasks.filter(task => task.docId !== action.task.docId);
    const newTask: Task = { ...action.task, completed: [...action.task.completed, action.userId]};
    const tasks: Task[] = [ ...filterdTasks, newTask ];
    return { ...state, tasks };
  }),
  //Complete Personal Task
  on(AppActions.completePersonalTaskSuccess, (state: State, action) => {
    const filterdTasks: PersonalTask[] = state.personalTasks.filter(task => task.docId !== action.taskDocId);
    const oldTask: PersonalTask = state.personalTasks.find(task => task.docId === action.taskDocId);
    const newTask = { ...oldTask, completed: true };
    const personalTasks: PersonalTask[] = [ ...filterdTasks, newTask ];
    return { ...state, personalTasks };
  }),
  //Update Course Task
  on(AppActions.updateCourseTaskSuccess, (state: State, action) => {
    const filterdTasks: Task[] = state.tasks.filter(task => task.docId !== action.task.docId );
    const tasks: Task[] = [ ...filterdTasks, action.task ];
    return { ...state, tasks };
  }),
  //Update Personal Task
  on(AppActions.updatePersonalTaskSuccess, (state: State, action) => {
    const filterdTasks: PersonalTask[] = state.personalTasks.filter(task => task.docId !== action.task.docId );
    const personalTasks: PersonalTask[] = [ ...filterdTasks, action.task ];
    return { ...state, personalTasks };
  }),
  //---------------------------------------------------Delete
  //Clear Store
  on(AppActions.clearStore, (state: State) => {
    const user = undefined;
    const courses = [];
    const tasks = [];
    const personalTasks = [];
    const taskFilter = ['allFirst', 'allSecond'];
    const currentPage = 'Login';
    const navigateBack = false;
    const alertMessage = undefined;
    const toastMessage = undefined;
    return { ...state, user, courses, tasks, personalTasks, taskFilter, currentPage, navigateBack, alertMessage, toastMessage};
  }),
  //Delete Course from Courses
  on(AppActions.deleteCourseSuccess, (state: State, action) => {
    const coursesArray: Course[] = state.courses;
    const courses: Course[] = coursesArray.filter(x => x.docId !== action.courseDocId);
    return { ...state, courses };
  }),
  //Delete Course from User
  on(AppActions.deleteUserCourseSuccess, (state: State, action) => {
    const stateUserCourses = state.user.courses;
    const newCourses = stateUserCourses.filter(x => x.courseId !== action.courseId);
    const user: User = { ...state.user, courses: newCourses };
    return { ...state, user };
  }),
  //Delete All Course Tasks
  on(AppActions.deleteCourseTasksSuccess, (state: State, action) => {
    const tasks: Task[] = state.tasks.filter(task => task.courseId !== action.courseId);
    return { ...state, tasks };
  }),
  //Delete Course Task
  on(AppActions.deleteCourseTaskSuccess, (state: State, action) => {
    const tasks: Task[] = state.tasks.filter(task => task.docId !== action.docId);
    return { ...state, tasks };
  }),
  //Clear Course Task Stats
  on(AppActions.clearCourseTaskStatsSuccess, (state: State, action) => {
    const filterdTasks: Task[] = state.tasks.filter(task => task.docId !== action.taskDocId);
    const oldTask: Task = state.tasks.find(task => task.docId === action.taskDocId);
    const updatedTask = { ...oldTask, completed: [], feedback: [] };
    const tasks: Task[] = [ ...filterdTasks, updatedTask ];
    return { ...state, tasks };
  }),
  //Delete Personal Task
  on(AppActions.deletePersonalTaskSuccess, (state: State, action) => {
    const personalTasks: PersonalTask[] = state.personalTasks.filter(task => task.docId !== action.docId);
    return { ...state, personalTasks };
  }),
  //---------------------------------------------------Alerts
  //Success (Toasts)
  on(AppActions.clearToast, (state: State, action) => {
    const toastMessage: string = undefined;
    return { ...state, toastMessage };
  }),
  on(AppActions.updateUserCourseSuccess, (state: State, action) => {
    const toastMessage: string = action.message;
    return { ...state, toastMessage };
  }),
  //Error (Alerts)
  on(AppActions.clearAlert, (state: State, action) => {
    const alertMessage: string = undefined;
    return { ...state, alertMessage };
  }),
  on(
    AppActions.registerFailed,
    AppActions.createUserRoleFailed,
    AppActions.changePasswordFailed,
    AppActions.deleteUserAuthFailed,
    AppActions.deleteUserFailed,
    AppActions.unsubscribeCoursesFailed,
    AppActions.loginFailed,
    AppActions.loadUserRoleFailed,
    AppActions.loadCourseTaskFailed,
    AppActions.loadPersonalTaskFailed,
    AppActions.createPersonalTaskFailed,
    AppActions.updatePersonalTaskFailed,
    AppActions.completePersonalTaskFailed,
    AppActions.deletePersonalTaskFailed,
    AppActions.updateCourseColorsFailed,
    AppActions.subscribeCourseFailed,
    AppActions.checkCourseIdInUse,
    AppActions.updateCourseFailed,
    AppActions.deleteCourseFailed,
    AppActions.unsubscribeCourseUsersFailed,
    AppActions.deleteCourseTasksFailed,
    AppActions.createCourseTaskFailed,
    AppActions.updateCourseTaskFailed,
    AppActions.completeCourseTaskFailed,
    AppActions.clearCourseTaskStatsFailed,
    AppActions.deleteCourseTaskFailed,
    (state: State, action) => {
    const alertMessage: string = action.message;
    return { ...state, alertMessage };
  }),


  // on(AppActions.checkCourseIdInUse, (state: State, action) => {
  //   const alertMessage: string = action.message;
  //   return { ...state, alertMessage };
  // }),
);
