import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // Assuming you have a ThemeContext for toggling themes

const Forms = ({ registerNumber }) => {
  const { isDarkMode } = useTheme(); // Dark mode toggle
  const [step, setStep] = useState(1);
  const [selectedForm, setSelectedForm] = useState(null);

  const formTypes = [
    { id: 1, name: 'Blue Form', description: 'Medical reasons', icon: 'document-outline' },
    { id: 2, name: 'Yellow Form', description: 'Co-curricular activity', icon: 'document-outline' },
    { id: 3, name: 'Pink Form', description: 'Placement', icon: 'document-outline' },
    { id: 4, name: 'Challan', description: 'Fee payment', icon: 'cash-outline' },
    { id: 5, name: 'Fee Demand Slip', description: 'Fee payment', icon: 'cash-outline' },
  ];

  const handleFormSelection = (form) => {
    setSelectedForm(form);
    const fileUrls = {
      1: 'https://cloud.appwrite.io/v1/storage/buckets/up/files/blue/view?project=christiteproject&project=christiteproject&mode=admin',
      2: 'https://cloud.appwrite.io/v1/storage/buckets/up/files/yellow/view?project=christiteproject&project=christiteproject&mode=admin',
      3: 'https://cloud.appwrite.io/v1/storage/buckets/up/files/pink/view?project=christiteproject&project=christiteproject&mode=admin',
      4: 'https://cloud.appwrite.io/v1/storage/buckets/up/files/challan/view?project=christiteproject&mode=admin',
      5: 'https://cloud.appwrite.io/v1/storage/buckets/up/files/feedem/view?project=christiteproject&mode=admin',
    };

    downloadFile(fileUrls[form.id]);
    setStep(2);
  };

  const downloadFile = async (fileUrl) => {
    try {
      Linking.openURL(fileUrl);
      Alert.alert('Download Success', 'File downloaded successfully.');
    } catch (error) {
      console.error('File download error:', error);
      Alert.alert('Download Failed', `Error downloading file: ${error.message}`);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step !== 1) {
        handleBackAction();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [step]);

  const handleBackAction = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: resetForm,
        },
      ]
    );
  };

  const resetForm = () => {
    setStep(1);
    setSelectedForm(null);
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {step === 1 && (
        <View style={styles.selectionSection}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>Select Form</Text>
          <View style={styles.formsContainer}>
            {formTypes.map((form) => (
              <TouchableOpacity key={form.id} style={[styles.formButton, isDarkMode ? styles.darkFormButton : styles.lightFormButton]} onPress={() => handleFormSelection(form)}>
                <Ionicons name={form.icon} size={24} color={isDarkMode ? '#fff' : '#1b4769'} />
                <Text style={[styles.buttonText, isDarkMode ? styles.darkText : styles.lightText]}>{form.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.uploadSection}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>Form Downloaded</Text>
          <Text style={[styles.messageText, isDarkMode ? styles.darkText : styles.lightText]}>The selected form has been successfully downloaded.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  lightContainer: {
    backgroundColor: '#f7f7f7',
  },
  darkContainer: {
    backgroundColor: '#1c1c1c',
  },
  selectionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  lightText: {
    color: '#1b4769',
  },
  darkText: {
    color: '#fff',
  },
  formsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  formButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightFormButton: {
    backgroundColor: '#f5f5f5',
  },
  darkFormButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    fontSize: 14,
    marginLeft: 10,
  },
  uploadSection: {
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Forms;