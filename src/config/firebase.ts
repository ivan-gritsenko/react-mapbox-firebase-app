import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBDX0ueshJWA4e5DJumqysX41ZRkwLXdbU",
  authDomain: "fir-mapbox-90a31.firebaseapp.com",
  databaseURL:
    "https://fir-mapbox-90a31-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-mapbox-90a31",
  storageBucket: "fir-mapbox-90a31.appspot.com",
  messagingSenderId: "384417173765",
  appId: "1:384417173765:web:d0b313e68b0fe13f5ce76c",
  measurementId: "G-9DVVLW8GHP",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export default app;
