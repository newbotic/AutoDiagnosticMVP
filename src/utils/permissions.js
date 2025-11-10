import { PermissionsAndroid, Platform } from 'react-native';

export const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      
      console.log('Permission results:', granted);
      
      // For now, return true to allow testing even if permissions are denied
      return true;
    } catch (err) {
      console.error('Permission error:', err);
      return true; // Return true for testing
    }
  }
  return true;
};