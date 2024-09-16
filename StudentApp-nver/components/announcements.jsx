import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Client, Databases } from 'react-native-appwrite';

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')  // Your Appwrite endpoint
    .setProject('christiteproject');         // Your Appwrite project ID

const databases = new Databases(client);

const fetchAnnouncements = async () => {
  try {
    const response = await databases.listDocuments(
      'christDatabase',      // Replace with your database ID
      'announcements'     // Replace with your collection ID
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }
};

const Announcement = () => {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const loadAnnouncement = async () => {
      const data = await fetchAnnouncements();
      if (data && data.length > 0) {
        setAnnouncement(data[0]);  // Let's assume we just display the first announcement
      }
    };

    loadAnnouncement();
  }, []);

  if (!announcement) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{announcement.title}</Text>
      <Image 
        source={{ uri: announcement.image }} 
        style={styles.image} 
        resizeMode="contain" 
      />
      <Text>{announcement.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});

export default Announcement;
