import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

//Register with email and password
export const registerUser = async (email, password, displayName) => {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
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
export const loginUser = async (email, password) => {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    return userCredentials.user;
}

//log out
export const logoutUser = async () => {
    await signOut(auth);
}

export const signUp = registerUser;
export const logIn = loginUser;
export const logOut = logoutUser;
