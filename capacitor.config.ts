import { CapacitorConfig } from '@capacitor/cli';
const APP_ID = 'com.example.app';
const APP_NAME = 'react-vite-capacitor';

const config: CapacitorConfig = {
  appId: APP_ID,
  appName: APP_NAME,
  webDir: 'dist',
  bundledWebRuntime: false,
  loggingBehavior: 'debug',
  server: {
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
      // electronIsEncryption: false,
      // electronWindowsLocation: "C:\\ProgramData\\CapacitorDatabases",
      // electronMacLocation: "/Users/YOUR_NAME/CapacitorDatabases",
      // electronLinuxLocation: "Databases"
    }
  }
};


export default config;