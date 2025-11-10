import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import DTCReader from '../components/DTCReader';

const DiagnosticScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Diagnostic Complet" />
      </Appbar.Header>

      <DTCReader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default DiagnosticScreen;