importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyBQpcQQAudcOSSXvXVoiliNWTQUqUZRkMk",
    authDomain: "studyplanner-8d145.firebaseapp.com",
    projectId: "studyplanner-8d145",
    storageBucket: "studyplanner-8d145.appspot.com",
    messagingSenderId: "221861203924",
    appId: "1:221861203924:web:0d3049c5e051704a461041"
});
const messaging = firebase.messaging();