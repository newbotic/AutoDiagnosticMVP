import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Card, Button } from 'react-native-paper';

// TEMPORARY MOCK
const BluetoothService = {
  scanForDevices: async () => {
    console.log('Scanning for OBD2 devices...');
    return [
      { name: 'OBD2 Simulator 1', id: 'sim-001', device: { id: 'sim-001', name: 'OBD2 Simulator 1' } },
      { name: 'ELM327 Bluetooth 2', id: 'sim-002', device: { id: 'sim-002', name: 'ELM327 Bluetooth 2' } },
      { name: 'Veepeak OBDCheck 3', id: 'sim-003', device: { id: 'sim-003', name: 'Veepeak OBDCheck 3' } }
    ];
  }
};

const OBDConnector = ({ visible, onClose, onConnect, isLoading }) => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanForDevices = async () => {
    setIsScanning(true);
    setDevices([]);

    try {
      const foundDevices = await BluetoothService.scanForDevices();
      setDevices(foundDevices);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeviceSelect = async (device) => {
    onConnect(device);
  };

  useEffect(() => {
    if (visible) {
      scanForDevices();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text style={styles.title}>🔗 CONECTARE OBD2</Text>
            <Text style={styles.subtitle}>
              SELECTEAZĂ DISPOZITIVUL OBD2 DIN LISTĂ
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={scanForDevices}
            disabled={isScanning}
            icon="refresh"
            style={styles.scanButton}
            labelStyle={styles.scanButtonText}
          >
            {isScanning ? 'SCANARE...' : 'RESCANEAZĂ'}
          </Button>
        </View>

        <ScrollView style={styles.devicesList}>
          {isScanning && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFC107" />
              <Text style={styles.loadingText}>CAUTĂ DISPOZITIVE OBD2...</Text>
            </View>
          )}

          {!isScanning && devices.length === 0 && (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  NU S-AU GĂSIT DISPOZITIVE OBD2.{'\n'}
                  ASIGURĂ-TE CĂ:{'\n'}
                  • ADAPTORUL OBD2 ESTE PORNIT{'\n'}
                  • BLUETOOTH ESTE ACTIVAT{'\n'}
                  • DISPOZITIVUL ESTE ÎN MODUL DE PAIRING
                </Text>
              </Card.Content>
            </Card>
          )}

          {devices.map((device, index) => (
            <Card key={index} style={styles.deviceCard}>
              <Card.Content>
                <View style={styles.deviceInfo}>
                  <View>
                    <Text style={styles.deviceName}>
                      {device.name || 'DISPOZITIV OBD2'}
                    </Text>
                    <Text style={styles.deviceId}>{device.id}</Text>
                  </View>
                  <Button
                    mode="contained"
                    onPress={() => handleDeviceSelect(device)}
                    disabled={isLoading}
                    compact
                    style={styles.connectButton}
                    labelStyle={styles.connectButtonText}
                  >
                    CONECTARE
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            mode="text" 
            onPress={onClose}
            style={styles.closeButton}
            labelStyle={styles.closeButtonText}
          >
            ÎNCHIDE
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark background for better contrast
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#2d2d2d',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFC107', // Yellow
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFC107', // Yellow
    marginTop: 4,
    fontWeight: '500',
  },
  actions: {
    marginBottom: 16,
  },
  scanButton: {
    borderColor: '#FFC107', // Yellow border
  },
  scanButtonText: {
    color: '#FFC107', // Yellow text
    fontWeight: 'bold',
  },
  devicesList: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#FFC107', // Yellow
    fontWeight: 'bold',
  },
  emptyCard: {
    marginBottom: 8,
    backgroundColor: '#2d2d2d',
  },
  emptyText: {
    textAlign: 'center',
    color: '#FFC107', // Yellow
    lineHeight: 20,
    fontWeight: '500',
  },
  deviceCard: {
    marginBottom: 8,
    backgroundColor: '#2d2d2d',
  },
  deviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFC107', // Yellow
  },
  deviceId: {
    fontSize: 12,
    color: '#FFA000', // Darker yellow
    marginTop: 2,
  },
  // YELLOW CONNECT BUTTON
  connectButton: {
    backgroundColor: '#FFC107', // Bright yellow
  },
  connectButtonText: {
    color: '#000000', // Black text for contrast
    fontWeight: 'bold',
    fontSize: 12,
  },
  // CLOSE BUTTON
  closeButton: {
    backgroundColor: '#FFC107', // Yellow
  },
  closeButtonText: {
    color: '#000000', // Black text
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 16,
  },
});

export default OBDConnector;