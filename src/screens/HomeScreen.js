import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, FAB, BottomNavigation, Text } from 'react-native-paper';
import BluetoothService from '../services/bluetoothService';
import OBDService from '../services/obdService';
import Dashboard from '../components/Dashboard';
import OBDConnector from '../components/OBDConnector';
import DTCReader from '../components/DTCReader';
import { requestBluetoothPermissions } from '../utils/permissions';

const HomeScreen = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    let interval;
    
    if (isConnected && hasPermissions) {
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
  }, [isConnected, hasPermissions]);

  const checkPermissions = async () => {
    const granted = await requestBluetoothPermissions();
    setHasPermissions(granted);
    if (!granted) {
      Alert.alert(
        'Permisiuni necesare',
        'Aplicația are nevoie de permisiuni Bluetooth și Localizare pentru a funcționa.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleConnect = async (device) => {
    if (!hasPermissions) {
      Alert.alert('Eroare', 'Permisiuni insuficiente. Acordați permisiunile necesare.');
      return;
    }

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

  const handleOpenConnection = () => {
    if (!hasPermissions) {
      Alert.alert(
        'Permisiuni necesare',
        'Pentru a scana dispozitive Bluetooth, acordați permisiunile necesare.',
        [
          { text: 'Închide', style: 'cancel' },
          { text: 'Reîncercă', onPress: checkPermissions }
        ]
      );
      return;
    }
    setShowConnectionModal(true);
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

      {!hasPermissions && (
        <View style={styles.permissionWarning}>
          <Text style={styles.permissionText}>
            ⚠️ Permisiuni Bluetooth necesare
          </Text>
        </View>
      )}

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
            {!hasPermissions 
              ? '🔒 Acordă permisiunile Bluetooth pentru a te conecta'
              : '🔌 Nu ești conectat la niciun dispozitiv OBD2\nApasă butonul de mai jos pentru a te conecta'
            }
          </Text>
        </View>
      )}

      <FAB
        icon="bluetooth"
        style={styles.fab}
        onPress={handleOpenConnection}
        label="Conectare OBD2"
        disabled={!hasPermissions}
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
  permissionWarning: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    margin: 8,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  permissionText: {
    color: '#856404',
    textAlign: 'center',
    fontWeight: '500',
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