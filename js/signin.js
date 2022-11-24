// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

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


var getEmail = document.getElementById("email");
var getPassword = document.getElementById("password");

const auth = getAuth();

var userData;
var userID;

window.signIn = function (e) {
  e.preventDefault();
  userData = {
    email: getEmail.value,
    password: getPassword.value
  }

  signInWithEmailAndPassword(auth, userData.email, userData.password)
    .then(function (success) {
      userID = success.user.uid;
      swal({
        title: 'Successfully!',
        text: 'Account login successfully!',
        icon: 'success',
        button: 'Ok'
      }).then(function () {
        window.location.replace('./../index.html')
      });
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == "auth/user-not-found") {
        swal({
          title: "User Problem!",
          text: "user not found!",
          icon: "warning",
          button: "OK",
        });
      }
      else if (errorCode == "auth/wrong-password") {
        swal({
          title: "Wrong Password!",
          text: "Password are wrong!",
          icon: "warning",
          button: "OK",
        });
      }
      else if (errorCode == "auth/too-many-requests") {
        swal({
          title: "Account Locked!",
          text: "Account are temporary locked!",
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