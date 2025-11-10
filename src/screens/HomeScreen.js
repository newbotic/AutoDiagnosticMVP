import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, FAB, BottomNavigation, Text } from 'react-native-paper';
//import BluetoothService from '../services/bluetoothService';
//import OBDService from '../services/obdService';
import Dashboard from '../components/Dashboard';
import OBDConnector from '../components/OBDConnector';
import DTCReader from '../components/DTCReader';

// Versiune mock pentru testare
const BluetoothService = {
  scanForDevices: async () => {
    console.log('Scanare dispozitive OBD2...');
    return [
      { name: 'OBD2 Simulator', id: 'sim-001' },
      { name: 'ELM327 Bluetooth', id: 'sim-002' }
    ];
  },
  connectToDevice: async (device) => {
    console.log('Conectat la:', device.name);
    return device;
  },
  disconnect: async () => {
    console.log('Deconectat');
  }
};

const OBDService = {
  initialize: async () => {
    console.log('OBD2 initializat');
    return true;
  },
  readAllData: async () => {
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
  readTroubleCodes: async () => [],
  clearTroubleCodes: async () => true
};

const HomeScreen = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    let interval;
    
    if (isConnected) {
      interval = setInterval(async () => {
        try {
          const data = await OBDService.readAllData();
          setVehicleData(data);
        } catch (error) {
          console.error('Error reading data:', error);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleConnect = async (device) => {
    setIsLoading(true);
    
    try {
      await BluetoothService.connectToDevice(device);
      await OBDService.initialize();
      setIsConnected(true);
      setShowConnectionModal(false);
      Alert.alert('✅ Succes', 'Conectat la dispozitivul OBD2!');
    } catch (error) {
      Alert.alert('❌ Eroare', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await BluetoothService.disconnect();
      setIsConnected(false);
      setVehicleData(null);
      Alert.alert('ℹ️ Deconectat', 'Conexiunea OBD2 a fost închisă.');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const tabs = [
    { key: 'dashboard', title: 'Dashboard', icon: 'car' },
    { key: 'diagnostic', title: 'Diagnostic', icon: 'wrench' },
  ];

  const renderScene = BottomNavigation.SceneMap({
    dashboard: () => <Dashboard vehicleData={vehicleData} />,
    diagnostic: () => <DTCReader />,
  });

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="AutoDiagnostic MVP" />
        {isConnected && (
          <Appbar.Action icon="bluetooth-off" onPress={handleDisconnect} />
        )}
      </Appbar.Header>

      {isConnected ? (
        <BottomNavigation
          navigationState={{ index: activeTab, routes: tabs }}
          onIndexChange={setActiveTab}
          renderScene={renderScene}
          barStyle={{ backgroundColor: '#ffffff' }}
        />
      ) : (
        <View style={styles.disconnectedContainer}>
          <Text style={styles.disconnectedText}>
            🔌 Nu ești conectat la niciun dispozitiv OBD2{'\n'}
            Apasă butonul de mai jos pentru a te conecta
          </Text>
        </View>
      )}

      <FAB
        icon="bluetooth"
        style={styles.fab}
        onPress={() => setShowConnectionModal(true)}
        label="Conectare OBD2"
      />

      <OBDConnector
        visible={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onConnect={handleConnect}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  disconnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  disconnectedText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});

export default HomeScreen;