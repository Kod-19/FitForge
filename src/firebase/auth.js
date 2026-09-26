import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const ensureFirebaseAuth = () => {
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Add your VITE_* values to a .env file before using auth.",
    );
  }

  return auth;
};

//Register with email and password
export const registerUser = async (email, password, displayName) => {
  const currentAuth = ensureFirebaseAuth();
  const userCredentials = await createUserWithEmailAndPassword(
    currentAuth,
    email,
    password,
  );
  const user = userCredentials.user;

  if (!db) {
    throw new Error(
      "Firestore is not configured. Add your VITE_* values to a .env file.",
    );
  }

  //set display name on the Auth profile
  await updateProfile(user, { displayName });

  //create Firestore document of the User
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: displayName,
    email: user.email,
    photoURL: null,
    streak: 0,
    joinedAt: serverTimestamp(),
  });

  return user;
};

//sign in with email and password
export const loginUser = async (email, password) => {
  const currentAuth = ensureFirebaseAuth();
  const userCredentials = await signInWithEmailAndPassword(
    currentAuth,
    email,
    password,
  );
  return userCredentials.user;
};

//log out
export const logoutUser = async () => {
  const currentAuth = ensureFirebaseAuth();
  await signOut(currentAuth);
};

export const signUp = registerUser;
export const logIn = loginUser;
export const logOut = logoutUser;
