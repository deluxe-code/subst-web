import { database } from "/scripts/modules/firebase.js";
async function createDummyUser() {
  return await database.collection("users").add({
    email: "nikolas@subst.app",
    password: "honeybunchesofoats98"
  }).then((docRef) => {
    console.log(`Document written with ID: ${docRef.id}`)
    return docRef;
  });
}

const pageElements;
pageElements.input = {
 email: document.getElementById("input_email"),
 password: document.getElementById("input_password"),
 signup: document.getElementById("button_signup")
}

pageElements.signup.addEventListener("click", function() {
  console.log("yaoo!!!");
  const providedEmail = pageElements.input.email.value;
  const providedPassword = pageElements.input.password.value;

});
db.collection("users").onSnapshot(doc => {
  console.log(doc.data());
})

createDummyUser().then(x => {
  console.log(x);
})
// newUserResponse.get().then(doc => {
//   doc.exists ? console.log(`Document data:${doc.data}`) : console.log("Document does not exist!");
// }).catch(error => {
//   console.error(`Error getting document: ${error}`);
// });




