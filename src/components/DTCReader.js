import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import OBDService from '../services/obdService';

const DTCReader = () => {
  const [troubleCodes, setTroubleCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const readTroubleCodes = async () => {
    setIsLoading(true);
    try {
      const codes = await OBDService.readTroubleCodes();
      setTroubleCodes(codes);
    } catch (error) {
      console.error('Error reading DTCs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTroubleCodes = async () => {
    setIsLoading(true);
    try {
      await OBDService.clearTroubleCodes();
      setTroubleCodes([]);
      setTimeout(readTroubleCodes, 1000);
    } catch (error) {
      console.error('Error clearing DTCs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCodeSeverity = (code) => {
    if (code.startsWith('P0')) return 'warning';
    if (code.startsWith('P1')) return 'error';
    if (code.startsWith('C')) return 'warning';
    if (code.startsWith('B')) return 'info';
    if (code.startsWith('U')) return 'error';
    return 'info';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: '#2196F3',
      warning: '#FF9800',
      error: '#F44336',
    };
    return colors[severity] || colors.info;
  };

  useEffect(() => {
    readTroubleCodes();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text style={styles.title}>🔧 Diagnostic Trouble Codes</Text>
          <Text style={styles.subtitle}>
            {troubleCodes.length > 0 
              ? `${troubleCodes.length} coduri de eroare găsite`
              : 'Nu s-au găsit coduri de eroare'
            }
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={readTroubleCodes}
          disabled={isLoading}
          icon="refresh"
          style={styles.button}
        >
          Reîmprospătează
        </Button>
        
        {troubleCodes.length > 0 && (
          <Button
            mode="contained"
            onPress={clearTroubleCodes}
            disabled={isLoading}
            icon="delete"
            style={[styles.button, styles.clearButton]}
            buttonColor="#F44336"
          >
            Șterge Coduri
          </Button>
        )}
      </View>

      <ScrollView style={styles.codesList}>
        {isLoading ? (
          <Card style={styles.loadingCard}>
            <Card.Content>
              <Text style={styles.loadingText}>Se citesc codurile DTC...</Text>
            </Card.Content>
          </Card>
        ) : troubleCodes.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                ✅ Nu s-au găsit coduri de eroare.{'\n'}
                Sistemul vehiculului funcționează corect.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          troubleCodes.map((code, index) => {
            const severity = getCodeSeverity(code);
            const color = getSeverityColor(severity);
            
            return (
              <Card key={index} style={styles.codeCard}>
                <Card.Content>
                  <View style={styles.codeHeader}>
                    <View style={[styles.severityDot, { backgroundColor: color }]} />
                    <Text style={styles.codeText}>{code}</Text>
                  </View>
                  
                  <Divider style={styles.divider} />
                  
                  <Text style={styles.codeDescription}>
                    {getCodeDescription(code)}
                  </Text>
                  
                  <View style={styles.severityBadge}>
                    <Text style={[styles.severityText, { color }]}>
                      {severity.toUpperCase()}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const getCodeDescription = (code) => {
  const commonCodes = {
    'P0300': 'Misfire aleatoriu detectat',
    'P0301': 'Misfire cilindrul 1',
    'P0302': 'Misfire cilindrul 2', 
    'P0420': 'Eficiență scăzută catalizator',
    'P0440': 'Problemă sistem ventilație combustibil',
    'P0500': 'Senzor viteză vehicul',
    'P0700': 'Problemă sistem transmisie',
  };
  
  return commonCodes[code] || 'Cod de eroare necunoscut - consultă manualul vehiculului';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  clearButton: {
    marginLeft: 8,
  },
  codesList: {
    flex: 1,
  },
  loadingCard: {
    marginBottom: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
  },
  emptyCard: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#4CAF50',
    lineHeight: 20,
  },
  codeCard: {
    marginBottom: 8,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    marginVertical: 8,
  },
  codeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DTCReader;