import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

//Register with email and password
export const registerUser = async (email, password, displayName) => {
    const userCredentials = await createUserWithEmailAndPassword(email, password, auth);
    const user = userCredentials.user;

    //set display name on the Auth profile
    await updateProfile(user, { displayName});

    //create Firestore document of the User
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: displayName,
        email: user.email,
        photoURL: null,
        streak: 0,
        joinedAt: serverTimestamp()
    });

    return user;
}

//sign in with email and password
export  const loginUser = (email, password) => {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    return userCredentials.user;
}

//sign in with Google
export const loginWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    //create Firestore doc only of it's their first time
    const useRef = doc(db, "users", user.uid);
    await setDoc(useRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        streak: 0,
        joinedAt: serverTimestamp()
    }, { merge: true }); //merge: true won't overwrite existing data

    return user;
}

//log out
export const logoutUser = () => {
    await signOut(auth);
}