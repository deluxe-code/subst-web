// const { auth } = require("../modules/tools/firebase");

import { auth } from "../modules/tools/firebase.js";

window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("forgotPassword").addEventListener("click", () => {
        console.log("Time to send them a firebase auth forgot password template response");
    });

    document.getElementById("actionButton").addEventListener("click", () => {
        console.log("TIME TO AUTHENTICATE THE USER");
        auth.tryLogin("ethannikolas@gmail.com","honeybunch9112");

    });
});
