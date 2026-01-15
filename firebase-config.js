// Firebase Configuration
// You need to replace this with your own Firebase config
// See SETUP.md for detailed instructions on how to set this up

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (only if config is set up)
if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully!');
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
} else {
    console.warn('Firebase not configured. Multiplayer features will not work.');
    console.warn('Please see SETUP.md for instructions on setting up Firebase.');
}
