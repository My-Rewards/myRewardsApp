import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);

  async function readNdef() {
    try {
      setIsScanning(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('Tag found:', tag);
      
      if (tag?.ndefMessage) {
        Alert.alert('Success', 'Tag read successfully!');
      }
    } catch (ex) {
      console.warn('NFC read error:', ex);
      Alert.alert('Error', 'Failed to read NFC tag');
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest().catch(() => { /* do nothing */ });
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity 
        onPress={readNdef}
        style={{
          padding: 20,
          backgroundColor: isScanning ? '#ccc' : '#007AFF',
          borderRadius: 8
        }}
        disabled={isScanning}
      >
        <Text style={{ color: isScanning ? '#666' : '#fff' }}>
          {isScanning ? 'Scanning...' : 'Scan NFC Tag'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}