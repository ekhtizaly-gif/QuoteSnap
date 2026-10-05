import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [customer, setCustomer] = useState('');
  const [service, setService] = useState('');
  const [issue, setIssue] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  const generatePDF = async () => {
    if (!customer || !price) {
      Alert.alert('Error', 'Please enter customer name and price');
      return;
    }

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #2c3e50; font-size: 36px; border-bottom: 2px solid #3498db; padding-bottom: 10px; text-transform: uppercase; }
            .header { margin-bottom: 40px; }
            .quote-info { font-size: 18px; margin-bottom: 30px; }
            .item { font-size: 20px; padding: 15px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
            .total { font-size: 28px; font-weight: bold; padding: 20px 0; color: #e74c3c; text-align: right; }
            .footer { margin-top: 50px; font-size: 14px; color: #7f8c8d; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${customer.toUpperCase()}'S QUOTE</h1>
          </div>
          <div class="quote-info">
            <p><strong>Date:</strong> ${date || new Date().toLocaleDateString()}</p>
            <p><strong>Valid for:</strong> 7 days</p>
          </div>
          
          <div class="item">
            <span><strong>Service:</strong> ${service || 'General Service'}</span>
            <span>$${price}</span>
          </div>
          
          ${issue ? `<div class="item"><span><strong>Issue Details:</strong> ${issue}</span><span></span></div>` : ''}
          
          <div class="total">
            Total: $${price}
          </div>
          
          <div class="footer">
            Thank you for your business!<br/>
            Generated via QuoteSnap
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      console.log('File has been saved to:', uri);
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>QuoteSnap</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Customer Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. John Doe" 
          value={customer} 
          onChangeText={setCustomer} 
        />
        
        <Text style={styles.label}>Service</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. AC Repair" 
          value={service} 
          onChangeText={setService} 
        />
        
        <Text style={styles.label}>Issue / Details</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Water leak" 
          value={issue} 
          onChangeText={setIssue} 
          multiline
        />

        <Text style={styles.label}>Date / Schedule</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. October 6" 
          value={date} 
          onChangeText={setDate} 
        />
        
        <Text style={styles.label}>Price ($)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 120" 
          value={price} 
          onChangeText={setPrice} 
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Generate Quote & Share</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
