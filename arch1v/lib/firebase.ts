import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp | null = null;

export function getFirebaseApp() {
	if (!firebaseApp) {
		firebaseApp = initializeApp({
			apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
			authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
			projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
			storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
			messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
			appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
		});
	}
	return firebaseApp!;
}

export const firebaseAuth = getAuth(getFirebaseApp());
export const firestore = getFirestore(getFirebaseApp());
export const googleProvider = new GoogleAuthProvider();

