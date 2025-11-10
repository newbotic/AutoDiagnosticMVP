// src/services/bluetoothService.js
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

class BluetoothService {
  constructor() {
    this.manager = new BleManager();
    this.connectedDevice = null;
  }

  // Request Bluetooth permissions for Android
  async requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      
      return (
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true; // iOS handles permissions differently
  }

  // Scan for Bluetooth devices
  async scanForDevices() {
    try {
      await this.requestPermissions();
      
      const discoveredDevices = [];
      
      // Start scanning
      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          return;
        }
        
        if (device && device.name) {
          // Check if device is already in the list
          const existingIndex = discoveredDevices.findIndex(d => d.id === device.id);
          if (existingIndex === -1) {
            discoveredDevices.push({
              id: device.id,
              name: device.name,
              localName: device.localName,
            });
          }
        }
      });

      // Stop scanning after 10 seconds
      setTimeout(() => {
        this.manager.stopDeviceScan();
      }, 10000);

      return discoveredDevices;
    } catch (error) {
      console.error('Bluetooth scan error:', error);
      throw error;
    }
  }

  // Connect to a device
  async connectToDevice(deviceId) {
    try {
      this.connectedDevice = await this.manager.connectToDevice(deviceId);
      await this.connectedDevice.discoverAllServicesAndCharacteristics();
      return this.connectedDevice;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  // Disconnect from device
  async disconnect() {
    if (this.connectedDevice) {
      await this.connectedDevice.cancelConnection();
      this.connectedDevice = null;
    }
  }

  // Check if Bluetooth is enabled
  async isBluetoothEnabled() {
    const state = await this.manager.state();
    return state === 'PoweredOn';
  }
}

export default new BluetoothService();