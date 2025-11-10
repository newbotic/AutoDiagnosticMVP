import BluetoothService from './bluetoothService';

const OBDService = {
  initialize: async () => {
    return await BluetoothService.initializeOBD();
  },

  readAllData: async () => {
    try {
      // For now, use mock data until real Bluetooth is fully implemented
      return {
        speed: Math.floor(Math.random() * 120),
        rpm: Math.floor(Math.random() * 3000) + 1000,
        coolantTemp: Math.floor(Math.random() * 40) + 70,
        engineLoad: Math.floor(Math.random() * 100),
        throttle: Math.floor(Math.random() * 100),
        intakeTemp: Math.floor(Math.random() * 30) + 20,
        timestamp: new Date().toISOString(),
        isConnected: true,
      };
    } catch (error) {
      console.error('Error reading OBD data:', error);
      // Fallback to mock data
      return OBDService.getMockData();
    }
  },

  getMockData: () => {
    return {
      speed: Math.floor(Math.random() * 120),
      rpm: Math.floor(Math.random() * 3000) + 1000,
      coolantTemp: Math.floor(Math.random() * 40) + 70,
      engineLoad: Math.floor(Math.random() * 100),
      throttle: Math.floor(Math.random() * 100),
      intakeTemp: Math.floor(Math.random() * 30) + 20,
      timestamp: new Date().toISOString(),
      isConnected: true,
    };
  },

  readTroubleCodes: async () => {
    try {
      // Mock DTC codes for now
      const codes = ['P0300', 'P0420', 'P0500'];
      return Math.random() > 0.7 ? codes : [];
    } catch (error) {
      console.error('Error reading trouble codes:', error);
      return [];
    }
  },

  clearTroubleCodes: async () => {
    try {
      console.log('Clearing trouble codes...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error clearing trouble codes:', error);
      return false;
    }
  }
};

export default OBDService;