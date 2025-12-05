
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://10.0.2.2:5000/api",   // when use simulator
  // baseURL: "http://192.168.100.12:5000/api",     // use real device with cable pc ip address 192.168.100.12
//  baseURL: 'https://intelli-quiz-backend-whcj.vercel.app/api',                           // when use backend on production

  withCredentials: true,
});

export default axiosInstance;
 





//also check server.js
// important notes 
// frontend to get app
// cd android
// .\gradlew assembleRelease
// android\app\build\outputs\apk\release\app-release.apk


//backend
// "scripts": {
//   "start": "node server.js",
//   "dev": "nodemon server.js"
// }
