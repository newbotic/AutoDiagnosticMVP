class OBDService {
  constructor() {
    this.isConnected = false;
    this.bluetoothService = null;
  }

  setBluetoothService(bluetoothService) {
    this.bluetoothService = bluetoothService;
  }

  async connect() {
    this.isConnected = true;
    return true;
  }

  async disconnect() {
    this.isConnected = false;
    return true;
  }

  async readDTCs() {
    return ['P0100', 'P0200', 'P0300'];
  }

  async readLiveData() {
    return {
      rpm: 2500,
      speed: 65,
      engineTemp: 85,
      fuelLevel: 75,
    };
  }
}

export default new OBDService();