import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';

const DataItem = ({ label, value }) => (
  <View style={styles.dataItem}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

const Dashboard = ({ vehicleData }) => {
  if (!vehicleData) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>Waiting for vehicle data...</Text>
        <Text style={styles.noDataSubtext}>Connect to an OBD2 device to see live data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.dataCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>📊 Live Vehicle Data</Text>
          <View style={styles.dataGrid}>
            <DataItem label="🚗 Speed" value={`${vehicleData.speed} km/h`} />
            <DataItem label="⚡ RPM" value={vehicleData.rpm} />
            <DataItem label="🌡️ Coolant Temp" value={`${vehicleData.coolantTemp}°C`} />
            <DataItem label="🔧 Engine Load" value={`${vehicleData.engineLoad}%`} />
            <DataItem label="🎚️ Throttle" value={`${vehicleData.throttle}%`} />
            <DataItem label="💨 Intake Temp" value={`${vehicleData.intakeTemp}°C`} />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  dataCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: '48%',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  dataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Dashboard;