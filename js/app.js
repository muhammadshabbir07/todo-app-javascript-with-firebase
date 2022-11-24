// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, get, child, set, remove, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

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


const database = getDatabase();
const auth = getAuth();
const dbRef = ref(database);

var uid;
var getfullName;
var key;





var getTodoUl = document.getElementById("todo-ul")
var hideli = document.getElementById("hide-li")
var getInput = document.getElementById("todoInput");
var getError = document.getElementById("label-error");
var getUserName = document.getElementById("username");

showTodo();
function showTodo() {
  onAuthStateChanged(auth, function (user) {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      uid = user.uid;
      const taskRef = ref(database, 'users/' + uid + '/todo/')
      onChildAdded(taskRef, function (snapshot) {
        if (snapshot.exists()) {
          // console.log(snapshot.val().key)
          hideli.style.display = "none";

          var renderLi = `
              <li>${snapshot.val().todoName}<div><i class="fa fa-pencil-alt"  onclick="editTodo(this, '${snapshot.val().key}')"></i><i class="fa fa-trash-alt"
                          onclick="deleteTodo(this, '${snapshot.val().key}')"></i></div>
              </li>
          `
          getTodoUl.innerHTML += renderLi

        } else {
          hideli.style.display = "block";
          console.log("No Data Available")
        }
      })
      console.log(uid)
      // ...
    } else {
      // User is signed out
      // ...
      window.location.href = "./../sign-in.html";
    }
  });
}

window.addTodo = function () {
  hideli.style.display = "none";

  // console.log(getInput.value)
  if (getInput.value != '') {
    hideli.style.display = "none";
    getError.style.display = 'none'

    swal({
      title: 'Task Added!',
      text: 'Task Added Successfully!',
      icon: 'success',
      button: 'Ok'
    }).then(function () {
      const todoKey = push(ref(database, 'todo')).key;
      // console.log(todoKey)
      const todoObj = {
        key: todoKey,
        todoName: getInput.value,
        date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
        time: `${new Date().toLocaleTimeString()}`
      };

      getInput.value = '';
      set(ref(database, 'users/' + uid + '/todo/' + todoKey), todoObj);
    });
  }
  else {
    getError.style.display = 'block'
    getError.style.color = 'red'
  }
}


window.editTodo = function (x, key) {

  swal("Write something here:", {
    title: "Enter Your Updated Todo",
    content: {
      element: "input",
      attributes: {
        value: x.parentElement.parentElement.innerText,
        type: "text"
      }
    }
  })
    .then((todoText) => {
      // console.log(todoText)
      // console.log(x.parentElement.parentElement.innerText)

      if (todoText == null) {
        swal({
          title: 'Warning!',
          text: 'You not Edit your Task!',
          icon: 'warning',
          button: 'Ok'
        })
      }
      else if (todoText == '') {
        swal({
          title: 'Warning!',
          text: 'This field is required!',
          icon: 'warning',
          button: 'Ok'
        })
      }
      else {
        const todoObj = {
          key: key,
          todoName: todoText,
          date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
          time: `${new Date().toLocaleTimeString()}`
        };

        set(ref(database, 'users/' + uid + '/todo/' + key), todoObj);
        // console.log(todoObj)

        swal({
          title: 'Updated!',
          text: 'Task Updated Successfully!',
          icon: 'success',
          button: 'Ok'
        })
        x.parentNode.parentNode.firstChild.textContent = todoText
      }
    });

  // var val = prompt("Enter Updated Value", x.parentNode.parentNode.firstChild.textContent)
}

window.deleteTodo = function (e, key) {
  const tasksRef = child(dbRef, 'users/' + uid + '/todo/' + key);

  swal({
    title: 'Task Deleted!',
    text: 'Did you sure delete your task?',
    icon: 'error',
    button: 'Ok'
  }).then(function () {
    remove(tasksRef)
    e.parentElement.parentElement.remove()
    hideli.style.display = "block";
  });



}

window.clearAll = function () {
  const tasksRef = ref(database, 'users/' + uid + '/todo');
  swal({
    title: 'Task Deleted!',
    text: 'Did you sure delete all your task?',
    icon: 'error',
    button: 'Ok'
  }).then(function () {
    remove(tasksRef)
    getTodoUl.innerHTML = '';
    hideli.style.display = "block";
    var createLabel = document.createElement("p");
    var addLabel = getTodoUl.appendChild(createLabel)

    var createText = document.createTextNode("Don't Have any Task yet..");
    addLabel.appendChild(createText)
    addLabel.setAttribute("id", "hide-li");
    getTodoUl.appendChild(addLabel)
  });
}

window.logout = function () {
  signOut(auth)
    .then(function () {
      console.log("Logout Successfully");
      window.location.href = "./../sign-in.html";
    })
    .catch(function (err) {
      console.log(err);
    });
};

function checkAuthentication() {
  onAuthStateChanged(auth, function (user) {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      uid = user.uid;
      get(child(dbRef, 'users/' + uid)).then(function (snapshot) {
        if (snapshot.exists()) {
          getfullName = snapshot.val().fullname;
          getUserName.innerHTML = getfullName;
        } else {
          console.log("No Data Available")
        }
      }).catch((error) => {
        console.error(error);
      });

      console.log(uid)
      // ...
    } else {
      // User is signed out
      // ...
      window.location.href = "./../sign-in.html";
    }
  });
}

checkAuthentication();
