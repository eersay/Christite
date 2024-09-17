import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import { databases } from './appwrite';
import LoadingScreen from './loading'; // Import the LoadingScreen component

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // For Modal
  const [isFullScreen, setIsFullScreen] = useState(false); // For full-screen image

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await databases.listDocuments('christDatabase', 'announcements');
      setAnnouncements(response.documents);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      setLoading(false);
    }
  };

  // Modal for showing enlarged announcement with full-screen functionality
  const renderModal = () => {
    return (
      <Modal
        visible={!!selectedAnnouncement}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setSelectedAnnouncement(null);
          setIsFullScreen(false); // Reset fullscreen on close
        }}
      >
        <View style={styles.modalOverlay}>
          {selectedAnnouncement && (
            <TouchableOpacity
              style={isFullScreen ? styles.fullScreenImageContainer : styles.modalContainer}
              onPress={() => setIsFullScreen(!isFullScreen)} // Toggle full-screen mode
            >
              <Image
                source={{ uri: selectedAnnouncement.image }}
                style={isFullScreen ? styles.fullScreenImage : styles.modalImage}
                resizeMode="contain"
              />
              {!isFullScreen && (
                <>
                  <Text style={styles.modalTitle}>{selectedAnnouncement.title}</Text>
                  <Text style={styles.modalDescription}>{selectedAnnouncement.description}</Text>
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => {
                      setSelectedAnnouncement(null);
                      setIsFullScreen(false); // Reset fullscreen when closing modal
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
      style={styles.announcementCard}
      onPress={() => setSelectedAnnouncement(item)} // Show modal on click
    >
      <Image source={{ uri: item.image }} style={styles.announcementImage} />
      <Text style={styles.announcementTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingScreen />; // Show the custom loading screen
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        numColumns={2} // Show two items per row
        columnWrapperStyle={styles.row} // Custom style for rows
      />
      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0EF',
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  announcementCard: {
    backgroundColor: '#fff',
    flex: 0.48, // Ensures two cards fit in a row, slightly narrower to give space
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2, // For shadow effect on Android
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  announcementImage: {
    width: '100%',
    height: 300, // Adjust height to make it rectangular
    borderRadius: 10,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color:'#1b4769',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: '#fff',
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
    color: '#666',
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
  // Full-screen Styles
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
