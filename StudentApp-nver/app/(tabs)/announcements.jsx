import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import { fetchAnnouncements } from '../../lib/appwrite'; // Import the function from appwrite.js
import LoadingScreen from '../../components/loading';
import { useTheme } from '../../context/ThemeContext'; // Import the useTheme hook

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); 
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Access theme context
  const { isDarkMode, themeColors } = useTheme(); 

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await fetchAnnouncements(); // Call the function from appwrite.js
      setAnnouncements(response);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch announcements:", error.message);
      setLoading(false);
    }
  };

  const renderModal = () => {
    return (
      <Modal
        visible={!!selectedAnnouncement}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setSelectedAnnouncement(null);
          setIsFullScreen(false); 
        }}
      >
        <View style={styles.modalOverlay}>
          {selectedAnnouncement && (
            <TouchableOpacity
              style={isFullScreen ? styles.fullScreenImageContainer : [styles.modalContainer, { backgroundColor: themeColors.background }]}
              onPress={() => setIsFullScreen(!isFullScreen)} 
            >
              <Image
                source={{ uri: selectedAnnouncement.image }}
                style={isFullScreen ? styles.fullScreenImage : styles.modalImage}
                resizeMode="contain"
              />
              {!isFullScreen && (
                <>
                  <Text style={[styles.modalTitle, { color: themeColors.text }]}>{selectedAnnouncement.title}</Text>
                  <Text style={[styles.modalDescription, { color: themeColors.text }]}>{selectedAnnouncement.description}</Text>
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => {
                      setSelectedAnnouncement(null);
                      setIsFullScreen(false); 
                    }}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.announcementCard, { backgroundColor: themeColors.background }]}
      onPress={() => setSelectedAnnouncement(item)}
    >
      <Image source={{ uri: item.image }} style={styles.announcementImage} />
      <Text style={[styles.announcementTitle, { color: themeColors.text }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  announcementCard: {
    flex: 0.48,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2, 
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
  },
  announcementImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    width: '90%',
  },
  modalImage: {
    width: '50%',
    height: 300,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1b4769',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  fullScreenImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
  },
});
