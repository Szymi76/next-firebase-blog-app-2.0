import { useState, useEffect, useReducer } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  Unsubscribe,
  User,
} from "firebase/auth";
import { addDoc, doc, setDoc } from "firebase/firestore";

// początkowy state reducera
const initialState = {
  loading: false,
  error: null,
};

// akcje dispatcha
enum ActionTypes {
  START = "START",
  SUCCESS = "SUCCESS",
  FAILRURE = "FAILRURE",
}

// typy state reducera
interface AuthState {
  loading: boolean;
  error: Error | null;
}

// reducer na logowanie się lub tworzenie użytkownika
const authReducer = (state: AuthState, type: ActionTypes) => {
  switch (type) {
    case ActionTypes.START:
      return {
        loading: true,
        error: null,
      };
    case ActionTypes.SUCCESS:
      return {
        loading: false,
        error: null,
      };
    case ActionTypes.FAILRURE:
      return {
        loading: false,
        error: new Error("Firebase auth error."),
      };
  }
};

// hook z aktualnych użytkownikiem
const useAuthUser = () => {
  const [user, setUser] = useState<User>(undefined);

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe?.();
  }, []);

  return user;
};

// hook do tworzenia nowgo użytkownika
const useAuthCreateUser = () => {
  const user = useAuthUser();

  const [state, dispatch] = useReducer(authReducer, initialState);

  const createUser = async (
    email: string,
    password: string,
    displayName: string,
    photoURL: string
  ) => {
    dispatch(ActionTypes.START);
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        updateProfile(result.user, {
          displayName: displayName,
          photoURL: photoURL,
        })
          .then(async () => {
            const userDocRef = doc(db, "users", result.user.uid);
            await setDoc(userDocRef, {
              uid: result.user.uid,
              // email: result.user.email,
              displayName: displayName,
              photoURL: photoURL,
            });
          })
          .then(res => {
            dispatch(ActionTypes.SUCCESS);
          })
          .catch(() => dispatch(ActionTypes.FAILRURE));
      })
      .catch(() => dispatch(ActionTypes.FAILRURE));
  };

  const { loading, error } = state;

  return [createUser, user, loading, error] as const;
};

// hook do logowania się
const useAuthSignIn = () => {
  const user = useAuthUser();

  const [state, dispatch] = useReducer(authReducer, initialState);

  const signIn = async (email: string, password: string) => {
    dispatch(ActionTypes.START);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        dispatch(ActionTypes.SUCCESS);
      })
      .catch(() => dispatch(ActionTypes.FAILRURE));
  };

  const { loading, error } = state;

  return [signIn, user, loading, error] as const;
};

export { useAuthUser, useAuthCreateUser, useAuthSignIn };
