import { PersonalTask } from './../interfaces/personalTask.interface';
import { Task } from './../interfaces/task.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromApp from './app.reducer';
import { AppState } from './app.reducer';
import { EChartsOption } from 'echarts';

//-----------------------------------------------------Selectors
export const selectAppState = createFeatureSelector<fromApp.State>(
  fromApp.appFeatureKey
);

//-----------------------------------------------------Base Selectors
export const selectCurrentPage = (s: AppState) => s.AppState.currentPage;
export const selectNavigateBack = (s: AppState) => s.AppState.navigateBack;
export const selectUser = (s: AppState) => s.AppState.user;
export const selectCourses = (s: AppState) => s.AppState.courses;
export const selectTasks = (s: AppState) => s.AppState.tasks;
export const selectPersonalTasks = (s: AppState) => s.AppState.personalTasks;
export const selectTaskFilter = (s: AppState) => s.AppState.taskFilter;
export const selectAlertMessage = (s: AppState) => s.AppState.alertMessage;
export const selectToastMessage = (s: AppState) => s.AppState.toastMessage;

//-----------------------------------------------------User Selectors
export const selectUserId = createSelector(
  selectUser,
  (user) => {
    if (user) {
      return user.id;
    } return '';
  }
);
export const selectUserDocId = createSelector(
  selectUser,
  (user) => {
    if (user?.docId) {
      return user.docId;
    } return '';
  }
);
export const selectUserRole = createSelector(
  selectUser,
  (user) => {
    if (user?.role) {
      return user.role;
    } return '';
  }
);


//-----------------------------------------------------Course Selectors
export const selectUserCourses = createSelector(
  selectUser,
  (user) => {
    if (user?.courses) {
      return user.courses;
    } return [];
  }
);

//coursesDocIds
export const selectCoursesDocIds = createSelector(
  selectCourses,
  (courses) => courses.map(course => course.docId)
);
//coursesDocIds
export const selectCourseSubscribers = createSelector(
  selectCourses,
  (courses) => {
    // userId: [courseIds]
    let subscibers: { subscriber: string; courseId: string }[] = [];
    courses.map(course => {
      course.subscribers.map(s => {
        const sub: { subscriber: string; courseId: string } = { subscriber: s, courseId: course.courseId };
        subscibers = [...subscibers, sub];
      });
    });

    const sortedsubs: { [user: string]: string[] } = { };
    const getUnique = (value, index, self) => self.indexOf(value) === index;

    const allSubs: string[] = subscibers.map(sub => sub.subscriber);
    const uniqueSubs = allSubs.filter(getUnique); //remove duplicate
    //add all unique subs with their courses to dictionary
    uniqueSubs.map(sub => subscibers.map(s => {
      if (!sortedsubs[sub]) { sortedsubs[sub] = []; }
      if (s.subscriber === sub) {
        sortedsubs[sub].push(s.courseId);
      }
    }));
    return sortedsubs;
  }
);
//single course
export const selectCourse = (courseId: string) => createSelector(
  selectCourses,
  (courses) => courses.find(course => course.courseId === courseId)
);
//-----------------------------------------------------Tasks Selectors
//CourseTasksDocIds
export const selectCourseTasksDocIds = createSelector(
  selectTasks,
  (tasks) => tasks.map(task => task.docId)
);
//PersonalTasksDocIds
export const selectPersonalTasksDocIds = createSelector(
  selectPersonalTasks,
  (tasks) => tasks.map(task => task.docId)
);
//single task
export const selectCourseTask = (taskDocId: string) => createSelector(
  selectTasks,
  (tasks) => tasks.find(task => task.docId === taskDocId)
);
export const selectFeedbackMessages = (taskDocId: string) => createSelector(
  selectCourseTask(taskDocId),
  (task) => task.feedback.map(f => { if (f.message) { return f.message; } }).filter(m => m !== undefined)
);
//Charts
export const selectChartCompleted = (taskDocId: string, subCount: number) => createSelector(
  selectCourseTask(taskDocId),
  (task) => {
    const completedCount = task.completed.length;
    const completedChart: EChartsOption = {
      title: {
        text: 'Completion Counter',
      },
      legend: {
        data: ['Completed', 'Not Completed'],
        bottom: '20'
      },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: {show: true},
            magicType: {show: true, type: ['bar', 'stack']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
          data: [''],
          axisTick: {show: false},
      },
      series: [
        {
          data: [completedCount],
          type: 'bar',
          stack: 'total',
          name: 'Completed',
          emphasis: {
              focus: 'series'
          },
        },
        {
          data: [subCount-completedCount],
          type: 'bar',
          stack: 'total',
          name: 'Not Completed',
          emphasis: {
              focus: 'series'
          },
        },
      ]
    };
    return completedChart;
  }
);
export const selectChartFeedback = (taskDocId: string) => createSelector(
  selectCourseTask(taskDocId),
  (task) => {
    const feedbackCount = task.feedback.filter(f => f.skipped === false).length;
    const feedbackSkippedCount = task.feedback.filter(f => f.skipped === true).length;
    const feedbackChart: EChartsOption = {
        title: {
          text: 'Feedback Counter',
        },
        legend: {
          data: ['Gave Feedback', 'Skipped Feedback'],
          bottom: '20'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
              mark: {show: true},
              magicType: {show: true, type: ['bar', 'stack']},
              restore: {show: true},
              saveAsImage: {show: true}
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
            data: [''],
            axisTick: {show: false},
        },
        series: [
          {
            data: [feedbackCount],
            type: 'bar',
            stack: 'total',
            name: 'Gave Feedback',
            emphasis: {
                focus: 'series'
            },
          },
          {
            data: [feedbackSkippedCount],
            type: 'bar',
            stack: 'total',
            name: 'Skipped Feedback',
            emphasis: {
                focus: 'series'
            },
          },
        ]
    };
    return feedbackChart;
  }
);
export const selectChartQuestions = (taskDocId: string) => createSelector(
  selectCourseTask(taskDocId),
  (task) => {
    const learnYes = task.feedback.filter(f => f.learn === 'yes').length;
    const learnNeutral = task.feedback.filter(f => f.learn === 'neutral').length;
    const learnNo = task.feedback.filter(f => f.learn === 'no').length;

    const difficultyYes = task.feedback.filter(f => f.difficulty === 'yes').length;
    const difficultyNeutral = task.feedback.filter(f => f.difficulty === 'neutral').length;
    const difficultyNo = task.feedback.filter(f => f.difficulty === 'no').length;

    const timeYes = task.feedback.filter(f => f.time === 'yes').length;
    const timeNeutral = task.feedback.filter(f => f.time === 'neutral').length;
    const timeNo = task.feedback.filter(f => f.time === 'no').length;

    const typeYes = task.feedback.filter(f => f.type === 'yes').length;
    const typeNeutral = task.feedback.filter(f => f.type === 'neutral').length;
    const typeNo = task.feedback.filter(f => f.type === 'no').length;

    const relevanceYes = task.feedback.filter(f => f.relevance === 'yes').length;
    const relevanceNeutral = task.feedback.filter(f => f.relevance === 'neutral').length;
    const relevanceNo = task.feedback.filter(f => f.relevance === 'no').length;
    const questionsChart: EChartsOption = {
        title: {
          text: 'Questions'
        },
        legend: {
          data: ['Yes', 'Neutral', 'No'],
          bottom: '20'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            magicType: {show: true, type: ['bar', 'stack']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['Learned\nSomething', 'To\nDifficult', 'Enough\nTime', 'Liked\nType', 'Relevant'],
          axisTick: { show: false },
          axisLabel: {
            rotate: 45,
            fontSize: '8px',
            fontWeight: 'bold',
          }

        },
        series: [
          {
            data: [learnYes, difficultyYes, timeYes, typeYes, relevanceYes],
            type: 'bar',
            stack: 'total',
            name: 'Yes',
            emphasis: {
                focus: 'series'
            },
          },
          {
            data: [learnNeutral, difficultyNeutral, timeNeutral, typeNeutral, relevanceNeutral],
            type: 'bar',
            stack: 'total',
            name: 'Neutral',
            emphasis: {
                focus: 'series'
            },
          },
          {
            data: [learnNo, difficultyNo, timeNo, typeNo, relevanceNo],
            type: 'bar',
            stack: 'total',
            name: 'No',
            emphasis: {
                focus: 'series'
            },
          },
        ]
    };
    return questionsChart;
  }
);

export const selectCourseTasks = (courseId: string) => createSelector(
  selectTasks,
  (tasks) => {
    if (tasks) {
      return tasks.filter(task => task.courseId === courseId);
    } return [];
  }
);
export const selectCourseTaskDocIds = (courseId: string) => createSelector(
  selectCourseTasks(courseId),
  (tasks) => tasks.map(task => task.docId)
);

export const selectSortedCourseTasks = (courseId: string) => createSelector(
  selectCourseTasks(courseId),
  (tasks) => {
    const sortedTasks: { [date: string]: Task[] } = { };
    const getUnique = (value, index, self) => self.indexOf(value) === index;

    const allDates: Date[] = tasks.map(task => task.date); //filter all Dates
    const uniqueDates = allDates.filter(getUnique); //remove duplicate Dates
    //add all unique Dates with their tasks to dictionary
    uniqueDates.map(date => sortedTasks[date.toString()] = tasks.filter(task => task.date === date));
    return sortedTasks;
  }
);

export const selectCountCourseTasks = (courseId: string) => createSelector(
  selectCourseTasks(courseId),
  (tasks) => {
    if (tasks) {
      const allTaskCount: number = tasks.length;
      const activatedTask: Task[] = tasks.filter(task => task.active === true);
      const activatedTaskCount: number = activatedTask.length;
      return activatedTaskCount + '/' + allTaskCount;
    } return '0/0';
  }
);

export const selectFilteredTasks = createSelector(
  selectTasks,
  selectPersonalTasks,
  selectTaskFilter,
  selectUserId,
  (tasks, pTasks, filter, userId) => {
    const filters = filter[0] + '|' + filter[1];

    const tasksActive = tasks.filter(task => task.active === true);
    const tasksOpen = tasksActive.filter(task => !task.completed.includes(userId));
    const tasksCompleted = tasksActive.filter(task => task.completed.includes(userId));

    const pTasksOpen = pTasks.filter(task => task.completed === false);
    const pTasksCompleted = pTasks.filter(task => task.completed === true);

    const filteredTasks: (Task | PersonalTask)[] = [];
    switch (filters) {
      case 'allFirst|allSecond': {
        return filteredTasks.concat(tasksActive, pTasks);
      }
      case 'allFirst|courses': {
        return filteredTasks.concat(tasksActive);
      }
      case 'allFirst|personal': {
        return filteredTasks.concat(pTasks);
      }
      case 'open|allSecond': {
        return filteredTasks.concat(tasksOpen, pTasksOpen);
      }
      case 'open|courses': {
        return filteredTasks.concat(tasksOpen);
      }
      case 'open|personal': {
        return filteredTasks.concat(pTasksOpen);
      }
      case 'completed|allSecond': {
        return filteredTasks.concat(tasksCompleted, pTasksCompleted);
      }
      case 'completed|courses': {
        return filteredTasks.concat(tasksCompleted);
      }
      case 'completed|personal': {
        return filteredTasks.concat(pTasksCompleted);
      }
      default: {
        return filteredTasks;
      }
    }
  }
);

export const selectSortedTasks = createSelector(
  selectFilteredTasks,
  (tasks) => {
    const sortedTasks: { [date: string]: (Task | PersonalTask)[] } = { };
    const getUnique = (value, index, self) => self.indexOf(value) === index;

    const allDates: Date[] = tasks.map(task => task.date); //filter all Dates
    const uniqueDates = allDates.filter(getUnique); //remove duplicate Dates
    //add all unique Dates with their tasks to dictionary
    uniqueDates.map(date => sortedTasks[date.toString()] = tasks.filter(task => task.date === date));
    return sortedTasks;
  }
);
