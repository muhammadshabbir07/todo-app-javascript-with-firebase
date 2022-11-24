// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjbYx3cNK_kJkyxWIMDv2Qm_ruXCEfSFw",
  authDomain: "todo-app-4f736.firebaseapp.com",
  projectId: "todo-app-4f736",
  storageBucket: "todo-app-4f736.appspot.com",
  messagingSenderId: "903262339672",
  appId: "1:903262339672:web:6e5eb9052e761d65d3802d",
  measurementId: "G-DKJ1KGLT5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const database = getDatabase();


var getFullName = document.getElementById("fullname");
var getEmail = document.getElementById("email");
var getPassword = document.getElementById("password");

var userData;
var userID;

window.signUp = function (e) {
  e.preventDefault();
  userData = {
    fullname: getFullName.value,
    email: getEmail.value,
    password: getPassword.value,
    date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
  }

  createUserWithEmailAndPassword(auth, userData.email, userData.password)
    .then(function (success) {
      userID = success.user.uid;
      set(ref(database, 'users/' + userID), userData);
      if (success) {
        swal({
          title: 'Successfully!',
          text: 'Account created successfully!',
          icon: 'success',
          button: 'Ok'
        }).then(function () {
          window.location.replace('./../sign-in.html')
        });
      }
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == "auth/email-already-in-use") {
        swal({
          title: "Email Exist!",
          text: "email address already exist!",
          icon: "info",
          button: "OK",
        });
      }
      else if (errorCode == "auth/invalid-email") {
        swal({
          title: "Invalid Email!",
          text: "invalid email address.!",
          icon: "info",
          button: "OK",
        });
      }
      else if (errorCode == "auth/operation-not-allowed") {
        swal({
          title: "Error!",
          text: "something went wrong!",
          icon: "error",
          button: "OK",
        });
      }
      else if (errorCode == "auth/weak-password") {
        swal({
          title: "Week Password!",
          text: "password is too weak!",
          icon: "warning",
          button: "OK",
        });
      }
      else {
        alert(errorMessage)
      }
    })
  console.log(userData);
};
