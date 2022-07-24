import { Feedback } from './../interfaces/feedback.interface';
import { PersonalTask } from './../interfaces/personalTask.interface';
import { Task } from './../interfaces/task.interface';
import { Course } from './../interfaces/course.interface';
import { Register } from './../interfaces/register.interface';
import { createAction, props } from '@ngrx/store';
import { Credentials } from '../interfaces/credentials.interface';
import { User } from '../interfaces/user.interface';

export const loadApp = createAction(
  '[App] Load App'
);

//Login
export const login = createAction(
  '[Auth] Login', props<{ cred: Credentials }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success', props<{ user: any }>()
);
export const loginFailed = createAction(
  '[Auth] Login Failed', props<{ message: string }>()
);

//Register
export const register = createAction(
  '[Auth] Register', props<{ cred: Register }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success', props<{ user: User }>()
);
export const registerFailed = createAction(
  '[Auth] Register Failed', props<{ message: string }>()
);

//Change Password
export const changePassword = createAction(
  '[Auth] Change Password', props<{ cred: Credentials; newPassword: string }>()
);
export const changePasswordSuccess = createAction(
  '[Auth] Change Password Success', props<{ message: string }>()
);
export const changePasswordFailed = createAction(
  '[Auth] Change Password Failed', props<{ message: string }>()
);

//-------------------------------------------------------Create Data
//Create User Role
export const createUserRoleSuccess = createAction(
  '[Auth] Create User Role Success'
);
export const createUserRoleFailed = createAction(
  '[Auth] Create User Role Failed', props<{ message: string }>()
);

//Check CourseId (Professor)
export const checkCourseId = createAction(
  '[Course] Check Course Id', props<{ course: Course; docId: string }>()
);
export const checkCourseIdInUse = createAction(
  '[Course] Check Course Id - In Use', props<{ message: string }>()
);
export const checkCourseIdFree = createAction(
  '[Course] Check Course Id - Free', props<{ course: Course; docId: string }>()
);
//Create Course (Professor)
export const createCourseSuccess = createAction(
  '[Course] Create Course Success', props<{ course: Course; docId: string; userDocId: string }>()
);
export const createCourseFailed = createAction(
  '[Course] Create Course Failed'
);
//Create Course Task (Professor)
export const createCourseTask = createAction(
  '[Course] Create Course Task', props<{ task: Task }>()
);
export const createCourseTaskSuccess = createAction(
  '[Course] Create Course Task Success', props<{ task: Task; docId: string }>()
);
export const createCourseTaskFailed = createAction(
  '[Course] Create Course Task Failed', props<{ message: string }>()
);
//Create Personal Task
export const createPersonalTask = createAction(
  '[Task] Create Personal Task', props<{ task: PersonalTask; userDocId: string }>()
);
export const createPersonalTaskSuccess = createAction(
  '[Task] Create Personal Task Success', props<{ task: PersonalTask; docId: string }>()
);
export const createPersonalTaskFailed = createAction(
  '[Task] Create Personal Task Failed', props<{ message: string }>()
);

//-------------------------------------------------------Load Data
//Load User Data (DocId, Role, Courses)
export const loadUserDataSuccess = createAction(
  '[User] Load User Data Success', props<{ role: string; docId: string; courses: { courseId: string; color: string}[] }>()
);
export const loadUserRoleFailed = createAction(
  '[User] Load User Data Failed', props<{ message: string }>()
);

//Load Courses
export const loadCoursesSuccess = createAction(
  '[Course] Load Courses Success', props<{ courses: Course[] }>()
);
export const loadCoursesFailed = createAction(
  '[Course] Load Courses Failed'
);

//Load Subscribed Course
export const loadSubscribedCourseSuccess = createAction(
  '[Course] Load Subscribed Course Success', props<{ course: Course; userId: string }>()
);
export const loadSubscribedCourseFailed = createAction(
  '[Course] Load Subscribed Courses Failed', props<{ message: string }>()
);

//Load Course Tasks
export const loadCourseTaskSuccess = createAction(
  '[Task] Load Course Tasks Success', props<{ tasks: Task[] }>()
);
export const loadCourseTaskFailed = createAction(
  '[Task] Load Course Tasks Failed', props<{ message: string }>()
);

//Load Subscribed Course Tasks
export const loadSubscribedCourseTaskSuccess = createAction(
  '[Task] Load Subscribed Course Tasks Success', props<{ tasks: Task[] }>()
);
export const loadSubscribedCourseTaskFailed = createAction(
  '[Task] Load Subscribed Course Tasks Failed', props<{ message: string }>()
);

//Load Personal Tasks
export const loadPersonalTaskSuccess = createAction(
  '[Task] Load Personal Tasks Success', props<{ tasks: PersonalTask[] }>()
);
export const loadPersonalTaskFailed = createAction(
  '[Task] Load Personal Tasks Failed', props<{ message: string }>()
);


//-------------------------------------------------------Update Data
//Subscribe to Course
export const subscribeCourse = createAction(
  '[Course] Subscribe Course', props<{ courseId: string; userDocId: string; userId: string }>()
);
export const subscribeCourseSuccess = createAction(
  '[Course] Subscribe Course Success', props<{ courseId: string; userId: string }>()
);
export const subscribeCourseFailed = createAction(
  '[Course] Subscribe Course Failed', props<{ message: string }>()
);
//Update Sub Count +1
export const updateSubCountSuccess = createAction(
  '[Course] Update subCount Success'
);
export const updateSubCountFailed = createAction(
  '[Course] Update subCount Failed'
);
//Update Sub Count -1
export const decreaseSubCount = createAction(
  '[Course] Decrease subCount', props<{ courseDocId: string; userId: string }>()
);
export const decreaseSubCountSuccess = createAction(
  '[Course] Decrease subCount Success'
);
export const decreaseSubCountFailed = createAction(
  '[Course] Decrease subCount Failed'
);

export const updateUserCourseSuccess = createAction(
  '[User] Update User Course Success', props<{ message: string }>()
);
export const updateUserCourseFailed = createAction(
  '[User] Update User Course Failed'
);

//Update Course (Professor)
export const updateCourse = createAction(
  '[Course] Update Course', props<{ course: Course }>()
);
export const updateCourseSuccess = createAction(
  '[Course] Update Course Success', props<{ course: Course }>()
);
export const updateCourseFailed = createAction(
  '[Course] Update Course Failed', props<{ message: string }>()
);

//Update Course Task (Professor)
export const updateCourseTask = createAction(
  '[Course] Update Course Task', props<{ task: Task }>()
);
export const updateCourseTaskSuccess = createAction(
  '[Course] Update Course Task Success', props<{ task: Task }>()
);
export const updateCourseTaskFailed = createAction(
  '[Course] Update Course Task Failed', props<{ message: string }>()
);

//Update Personal Task
export const updatePersonalTask = createAction(
  '[Task] Update Personal Task', props<{ task: PersonalTask; userDocId: string }>()
);
export const updatePersonalTaskSuccess = createAction(
  '[Task] Update Personal Task Success', props<{ task: PersonalTask }>()
);
export const updatePersonalTaskFailed = createAction(
  '[Task] Update Personal Task Failed', props<{ message: string }>()
);

//Complete Course Task
export const completeCourseTask = createAction(
  '[Task] Complete Course Task', props<{ task: Task; userId: string; feedback: Feedback }>()
);
export const completeCourseTaskSuccess = createAction(
  '[Task] Complete Course Task Success', props<{ task: Task; userId: string }>()
);
export const completeCourseTaskFailed = createAction(
  '[Task] Complete Course Task Failed', props<{ message: string }>()
);

//Complete Personal Task
export const completePersonalTask = createAction(
  '[Task] Complete Personal Task', props<{ taskDocId: string; userDocId: string }>()
);
export const completePersonalTaskSuccess = createAction(
  '[Task] Complete Personal Task Success', props<{ taskDocId: string }>()
);
export const completePersonalTaskFailed = createAction(
  '[Task] Complete Personal Task Failed', props<{ message: string }>()
);

//Update Course Colors
export const updateCourseColors = createAction(
  '[Settings] Update Course Colors', props<{ userDocId: string; courses: { courseId: string; color: string }[] }>()
);
export const updateCourseColorsSuccess = createAction(
  '[Settings] Update Course Colors Success', props<{ courses: { courseId: string; color: string }[] }>()
);
export const updateCourseColorsFailed = createAction(
  '[Settings] Update Course Colors Failed', props<{ message: string }>()
);

//Update Task Filter
export const updateTaskFilter = createAction(
  '[Task] Update Task Filter', props<{ filter: string[] }>()
);

//Current Page
export const updateCurrentPage = createAction(
  '[App] Update Current Page', props<{ pageName: string }>()
);

//Navigate Back
export const updateNavigateBack = createAction(
  '[App] Update Navigate Back', props<{ show: boolean }>()
);
//Alert Message Clear
export const clearAlert = createAction(
  '[App] Clear Alert'
);
//Toast Message Clear
export const clearToast = createAction(
  '[App] Clear Toast'
);

//-------------------------------------------------------Delete Data
//Clear Store
export const clearStore = createAction(
  '[App] Clear Store'
);
//Delete User Auth
export const deleteUserAuth = createAction(
  '[Settings] Delete User Auth', props<{ cred: Credentials; userDocId: string }>()
);
export const deleteUserAuthSuccess = createAction(
  '[Settings] Delete User Auth Success', props<{ userDocId: string }>()
);
export const deleteUserAuthFailed = createAction(
  '[Settings] Delete User Auth Failed', props<{ message: string }>()
);
//Delete User
export const deleteUserSuccess = createAction(
  '[Settings] Delete User Success'
);
export const deleteUserFailed = createAction(
  '[Settings] Delete User Failed', props<{ message: string }>()
);
//Unsubscribe Courses (Prof)
export const unsubscribeCourses = createAction(
  '[Settings] Unsubscribe Courses', props < { userId: string; courseId: string[] }>()
);
export const unsubscribeCoursesSuccess = createAction(
  '[Settings] Unsubscribe Courses Success'
);
export const unsubscribeCoursesFailed = createAction(
  '[Settings] Unsubscribe Courses Failed', props<{ message: string }>()
);

//Delete All Courses (Professor) -coursesDocId[]
export const deleteUserCourses = createAction(
  '[Settings] Delete User Courses', props<{ coursesDocId: string[] }>()
);
export const deleteUserCoursesSuccess = createAction(
  '[Settings] Delete User Courses Success'
);
export const deleteUserCoursesFailed = createAction(
  '[Settings] Delete User Courses Failed', props<{ message: string }>()
);
//Delete All CoursesTasks (Professor) -taskDocId[]
export const deleteUserCourseTasks = createAction(
  '[Settings] Delete User Course Tasks', props<{ tasksDocId: string[] }>()
);
export const deleteUserCourseTasksSuccess = createAction(
  '[Settings] Delete User Course Tasks Success'
);
export const deleteUserCourseTasksFailed = createAction(
  '[Settings] Delete User Course Tasks Failed', props<{ message: string }>()
);


// //Delete All PersonalTasks (Professor) -taskDocId[]
// export const deleteUserPersonalTasks = createAction(
//   '[Settings] Delete User Personal Tasks', props<{ tasksDocId: string[] }>()
// );
// export const deleteUserPersonalTasksSuccess = createAction(
//   '[Settings] Delete User Personal Tasks Success'
// );
// export const deleteUserPersonalTasksFailed = createAction(
//   '[Settings] Delete User Personal Tasks Failed', props<{ message: string }>()
// );

//Delete Course (Professor)
export const deleteCourse = createAction(
  '[Course] Delete Course', props<{ courseDocId: string }>()
);
export const deleteCourseSuccess = createAction(
  '[Course] Delete Course Success', props<{ courseDocId: string }>()
);
export const deleteCourseFailed = createAction(
  '[Course] Delete Course Failed', props<{ message: string }>()
);
//Delete User Course (Professor)
export const deleteUserCourse = createAction(
  '[Course] Delete User Course', props<{ userDocId: string; course: { courseId: string; color: string } }>()
);
export const deleteUserCourseSuccess = createAction(
  '[Course] Delete User Course Success', props<{ courseId: string }>()
);
export const deleteUserCourseFailed = createAction(
  '[Course] Delete User Course Failed', props<{ message: string }>()
);
//Unsubscribe All Students (Prof)
export const unsubscribeCourseUsers = createAction(
  '[Course] Unsubscribe Course Users', props<{ subscriber: string; courseId: string }>()
);
export const unsubscribeCourseUsersSuccess = createAction(
  '[Course] Unsubscribe Course Users Success'
);
export const unsubscribeCourseUsersFailed = createAction(
  '[Course] Unsubscribe Course Users Failed', props<{ message: string }>()
);
//Delete Course All Tasks (Professor)
export const deleteCourseTasks = createAction(
  '[Course] Delete Course Tasks', props<{ courseId: string }>()
);
export const deleteCourseTasksSuccess = createAction(
  '[Course] Delete Course Tasks Success', props<{ courseId: string }>()
);
export const deleteCourseTasksFailed = createAction(
  '[Course] Delete Course Tasks Failed', props<{ message: string }>()
);
//Delete Course Task (Professor)
export const deleteCourseTask = createAction(
  '[Course] Delete Course Task', props<{ docId: string }>()
);
export const deleteCourseTaskSuccess = createAction(
  '[Course] Delete Course Task Success', props<{ docId: string }>()
);
export const deleteCourseTaskFailed = createAction(
  '[Course] Delete Course Task Failed', props<{ message: string }>()
);
//Clear Course Task Stats (Professor)
export const clearCourseTaskStats = createAction(
  '[Course] Clear Course Task Stats', props<{ taskDocId: string }>()
);
export const clearCourseTaskStatsSuccess = createAction(
  '[Course] Clear Course Task Stats Success', props<{ taskDocId: string }>()
);
export const clearCourseTaskStatsFailed = createAction(
  '[Course] Clear Course Task Stats Failed', props<{ message: string }>()
);
//Delete Personal Task
export const deletePersonalTask = createAction(
  '[Task] Delete Personal Task', props<{ docId: string; userDocId: string }>()
);
export const deletePersonalTaskSuccess = createAction(
  '[Task] Delete Personal Task Success', props<{ docId: string }>()
);
export const deletePersonalTaskFailed = createAction(
  '[Task] Delete Personal Task Failed', props<{ message: string }>()
);
