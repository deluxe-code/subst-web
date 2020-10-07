const _fbConfig = {
    apiKey: "AIzaSyB0YksSwW1EB788GmuDuZpO2tTKJAezHpU",
    authDomain: "subst-app.firebaseapp.com",
    databaseURL: "https://subst-app.firebaseio.com",
    projectId: "subst-app",
    storageBucket: "subst-app.appspot.com",
    messagingSenderId: "172488889933",
    appId: "1:172488889933:web:9f9bee754b15f31a1c6e04",
    measurementId: "G-VGQR7410B4"
};
// Initialize Firebase
firebase.initializeApp(_fbConfig);
firebase.analytics();
// Let's refactor so that the signin and login pages handle post-response behavior from firebase auth.
export const auth = {
    trySignup: async (email, password) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode, errorMessage);
          }).then(function(res) {
            console.log(res);
          });

    },
    tryLogin: async (email,password) => {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            console.error("tryLogin() has failed to authenticate");
            var errorCode = error.code;
            var errorMessage = error.message;
          }).then(function(res) {
              if (res.isNewUser) {
                  window.location = "#WELCOME";
              } else {
                  window.location = "http://localhost:5500/app/home.html"
              }
          });
    }
};
export const database = firebase.firestore();




