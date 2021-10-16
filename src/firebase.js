// For Firebase JS SDK v7.20.0 and later, measurementId is optional

  import firebase from "firebase";
  
  const firebaseApp=firebase.initializeApp({
    
        apiKey: "AIzaSyBXw0R9XsboiAu_8xBV_86u3rKaNEVu3wY",
        authDomain: "instagram-clone-reactjs-29b5f.firebaseapp.com",
        projectId: "instagram-clone-reactjs-29b5f",
        storageBucket: "instagram-clone-reactjs-29b5f.appspot.com",
        messagingSenderId: "1073174624110",
        appId: "1:1073174624110:web:23c151b3186c799684f37f",
        measurementId: "G-6ZN2RRFKJE"
      
  });

  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export{db,auth,storage};

 // export default db;