import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

googleProvider.setCustomParameters({ prompt: "select_account" });

async function ensureGoogleUserProfile(user) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    streak: 0,
    joinedAt: serverTimestamp(),
  }, { merge: true });
}

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

//sign in with Google
export const loginWithGoogle = async () => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        await ensureGoogleUserProfile(userCredential.user);
        return userCredential.user;
    } catch (error) {
        if (
            error?.code === "auth/popup-blocked" ||
            error?.code === "auth/popup-closed-by-user" ||
            error?.code === "auth/operation-not-supported-in-this-environment"
        ) {
            await signInWithRedirect(auth, googleProvider);
            return null;
        }

        throw error;
    }
}

export const handleGoogleRedirectResult = async () => {
    const result = await getRedirectResult(auth);
    if (!result?.user) return null;

    await ensureGoogleUserProfile(result.user);
    return result.user;
}

//log out
export const logoutUser = async () => {
    await signOut(auth);
}

export const signUp = registerUser;
export const logIn = loginUser;
export const logInWithGoogle = loginWithGoogle;
export const logOut = logoutUser;
