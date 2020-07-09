import { db } from "/scripts/modules/firebase.js";
async function createDummyUser() {
  return await db.collection("users").add({
    email: "nikolas@subst.app",
    password: "honeybunchesofoats98"
  }).then((docRef) => {
    console.log(`Document written with ID: ${docRef.id}`)
    return docRef;
  });
}

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




