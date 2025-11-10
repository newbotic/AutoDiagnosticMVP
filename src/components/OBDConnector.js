import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import BluetoothService from '../services/bluetoothService';

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
            <Text style={styles.title}>🔗 Conectare OBD2</Text>
            <Text style={styles.subtitle}>
              Selectează dispozitivul OBD2 din listă
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
          >
            {isScanning ? 'Scanare...' : 'Rescanează'}
          </Button>
        </View>

        <ScrollView style={styles.devicesList}>
          {isScanning && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.loadingText}>Caută dispozitive OBD2...</Text>
            </View>
          )}

          {!isScanning && devices.length === 0 && (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  Nu s-au găsit dispozitive OBD2.{'\n'}
                  Asigură-te că:{'\n'}
                  • Adaptorul OBD2 este pornit{'\n'}
                  • Bluetooth este activat{'\n'}
                  • Dispozitivul este în modul de pairing
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
                      {device.name || 'Dispozitiv OBD2'}
                    </Text>
                    <Text style={styles.deviceId}>{device.id}</Text>
                  </View>
                  <Button
                    mode="contained"
                    onPress={() => handleDeviceSelect(device)}
                    disabled={isLoading}
                    compact
                  >
                    Conectare
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button mode="text" onPress={onClose}>
            Închide
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
  },
  actions: {
    marginBottom: 16,
  },
  scanButton: {
    borderColor: '#2196F3',
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
    color: '#666',
  },
  emptyCard: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  deviceCard: {
    marginBottom: 8,
  },
  deviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    marginTop: 16,
  },
});

export default OBDConnector;