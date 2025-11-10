import { BleManager } from 'react-native-ble-plx';

class BluetoothService {
  constructor() {
    this.manager = new BleManager();
    this.connectedDevice = null;
    this.isScanning = false;
  }

  scanForDevices = async () => {
    return new Promise((resolve, reject) => {
      if (this.isScanning) {
        reject(new Error('Scan already in progress'));
        return;
      }

      this.isScanning = true;
      
      // For now, return mock devices until we set up real Bluetooth
      setTimeout(() => {
        const mockDevices = [
          { name: 'OBD2 Simulator', id: 'sim-001', device: { id: 'sim-001', name: 'OBD2 Simulator' } },
          { name: 'ELM327 Bluetooth', id: 'sim-002', device: { id: 'sim-002', name: 'ELM327 Bluetooth' } },
          { name: 'Veepeak OBDCheck', id: 'sim-003', device: { id: 'sim-003', name: 'Veepeak OBDCheck' } }
        ];
        this.isScanning = false;
        resolve(mockDevices);
      }, 2000);
    });
  };

  connectToDevice = async (deviceInfo) => {
    try {
      console.log('Connecting to device:', deviceInfo.name);
      // Simulate connection for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.connectedDevice = deviceInfo;
      return deviceInfo;
    } catch (error) {
      throw new Error(`Connection failed: ${error.message}`);
    }
  };

  disconnect = async () => {
    if (this.connectedDevice) {
      console.log('Disconnecting from device');
      this.connectedDevice = null;
    }
    this.isScanning = false;
  };

  // Placeholder methods for real Bluetooth (will be implemented later)
  initializeOBD = async () => {
    console.log('OBD initialized (mock)');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  sendOBDCommand = async (command) => {
    console.log('Sending OBD command:', command);
    await new Promise(resolve => setTimeout(resolve, 500));
    return "41 00 00 00 00"; // Mock response
  };
}

export default new BluetoothService();
