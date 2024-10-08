import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getCurrentUser, updatePhoneNumber, getCourseNameByCode } from '../../lib/appwrite';

const ProfilePage = () => {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [editingPhone, setEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setNewPhone(currentUser.phNo);
        const fetchedCourseName = await getCourseNameByCode(currentUser.course_id);
        setCourseName(fetchedCourseName || 'Unknown Course');
      }
    };
    fetchUser();
  }, []);

  const handleSavePhoneNumber = async () => {
    if (newPhone !== user.phNo) {
      try {
        await updatePhoneNumber(user.$id, newPhone); // Ensure user.$id and newPhone are correct
        setUser({ ...user, phNo: newPhone });
      } catch (error) {
        console.error("Error updating phone number:", error);
      }
    }
    setEditingPhone(false);
  };
  

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Header Section */}
      <View style={[styles.headerContainer, isDarkMode ? styles.darkHeader : styles.lightHeader]}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>

        {/* Followers and Following */}
        <View style={styles.followContainer}>
          <Text style={styles.followText}>
            Semester: {user.semester}{"\n \n"}{courseName}
          </Text>
        </View>
      </View>

      {/* User Details Section */}
      <View style={[styles.detailsContainer, isDarkMode ? styles.darkDetails : styles.lightDetails]}>
        <DetailItem label="Register Number" value={user.registerNumber} icon="👤" isDarkMode={isDarkMode} />
        <DetailItem label="Email" value={user.email} icon="✉️" isDarkMode={isDarkMode} />
        <View style={styles.phoneRow}>
        <DetailItem
            label="Mobile"
            value={
              editingPhone ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={[
                      styles.input,
                      isDarkMode ? darkStyles.input : lightStyles.input,
                      { width: 150, height: 40 }, // Fixed size
                    ]}
                    value={newPhone}
                    onChangeText={setNewPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              ) : (
                user.phNo
              )
            }
            icon="📞"
            isDarkMode={isDarkMode}
          />
          {editingPhone ? (
            <Button title="Save" onPress={handleSavePhoneNumber} />
          ) : (
            <TouchableOpacity onPress={() => setEditingPhone(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </View>
  );
};

// Detail Item Component for reusability
const DetailItem = ({ label, value, icon, isDarkMode }) => (
  <View style={styles.detailRow}>
    {typeof icon === 'string' ? (
      <Text style={styles.icon}>{icon}</Text>
    ) : (
      <Image source={icon} style={styles.icon} />
    )}
    <View>
      <Text style={[styles.label, isDarkMode ? { color: '#bbb' } : { color: '#777' }]}>{label}</Text>
      <Text style={[styles.value, isDarkMode ? { color: '#fff' } : { color: '#333' }]}>{value}</Text>
    </View>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  headerContainer: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    paddingVertical: 40,
  },
  lightHeader: {
    backgroundColor: '#1b4769',
  },
  darkHeader: {
    backgroundColor: '#222',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    color: '#fff',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 15,
  },
  followText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  detailsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  lightDetails: {
    backgroundColor: '#F5F5F5',
  },
  darkDetails: {
    backgroundColor: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    paddingHorizontal: 10,
    width: '60%',
  },
  editButton: {
    marginLeft: 10,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});

// Light Mode Styles
const lightStyles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    color: '#333',
  },
});

// Dark Mode Styles
const darkStyles = StyleSheet.create({
  input: {
    backgroundColor: '#444',
    color: '#fff',
  },
});

export default ProfilePage;
