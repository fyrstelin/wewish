import Firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

export const App = Firebase.initializeApp({
    apiKey: "AIzaSyBS8xeJ-azSfr6PStW-TD3I0aOGCc651Zk",
    authDomain: "wewish.app",
    databaseURL: "https://wewish-158417.firebaseio.com",
    projectId: "wewish-158417",
    storageBucket: "wewish-158417.appspot.com",
    messagingSenderId: "607064698105"
});

export const Database = App.database();
export const Auth = App.auth();
export type User = Firebase.User;