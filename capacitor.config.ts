import { CapacitorConfig } from '@capacitor/cli';
const APP_ID = 'com.example.app';
const APP_NAME = 'CE Scanner';

const config: CapacitorConfig = {
  appId: APP_ID,
  appName: APP_NAME,
  webDir: 'dist',
  bundledWebRuntime: false,
  loggingBehavior: 'debug',
  server: {
    // url: "http://192.168.210.187:5173",
    // cleartext: true,
    androidScheme: "http"
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: APP_NAME,
      iosBiometric: {
        biometricAuth: false,
        biometricTitle: "Biometric login for capacitor sqlite"
      },
      androidIsEncryption: false,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: "Biometric login for capacitor sqlite",
        biometricSubTitle: "Log in using your biometric"
      },
    }
  }
};


export default config;