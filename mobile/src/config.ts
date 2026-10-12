// mobile/src/config.ts
// Configuration for connecting mobile frontend to backend server

import { Platform } from 'react-native';

/**
 * BACKEND API BASE URL INSTRUCTIONS:
 * -------------------------------------------------------------
 * 1. Physical Android Phone (with Expo Go on Wi-Fi):
 *    Replace the IP address below with your computer's local Wi-Fi IP address!
 *    Find your IP by opening PowerShell and running: ipconfig
 *    Look for "IPv4 Address", for example: http://192.168.1.5:5000
 *
 * 2. Android Studio Emulator:
 *    Android emulator uses the special alias "10.0.2.2" to reach the host computer:
 *    http://10.0.2.2:5000
 *
 * 3. iOS Simulator / Web / Local testing:
 *    http://localhost:5000
 */

// Your PC's current LAN IP address detected from Metro Bundler:
const LOCAL_LAN_IP = '10.241.46.164';

export const API_BASE_URL = Platform.select({
  android: `http://${LOCAL_LAN_IP}:5000/api`, // Works on physical device via Wi-Fi! Change to 10.0.2.2 for emulator
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

// Key used in SecureStore for saving JWT token
export const AUTH_TOKEN_KEY = 'student_expense_tracker_jwt_token';
export const USER_INFO_KEY = 'student_expense_tracker_user_info';
