import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { database } from '../../lib/appwrite'; 
import Loading from '../../components/loading';
import { getCurrentUser } from '../../lib/appwrite'; 
import { Query } from 'appwrite'; 
import { useTheme } from '../../context/ThemeContext'; // Import the theme context
import { Linking } from 'react-native'; // Import Linking for sending emails

const FacultyDetails = () => {
  const { isDarkMode } = useTheme(); // Access dark mode state
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const currentStudent = await getCurrentUser();
        if (currentStudent) {
          setStudent(currentStudent);
        } else {
          console.error('No student found with the current session');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    const fetchFacultiesAndSubjects = async () => {
      if (!student?.course_id) return;

      setLoading(true);
      try {
        const subjectResponse = await database.listDocuments(
          'christDatabase',
          'subjects',
          [Query.equal('course_id', student.course_id)]
        );

        const studentSubjectIds = subjectResponse.documents
          .filter(subject => subject.semester === student.semester)
          .map(subject => subject.subject_id);

        const facultyResponse = await database.listDocuments('christDatabase', 'staff');

        const relevantFaculties = facultyResponse.documents.filter(faculty =>
          faculty.subjects_taught.some(subject => 
            studentSubjectIds.includes(subject)
          )
        );

        setFilteredFaculties(relevantFaculties);
        setFaculties(facultyResponse.documents);
      } catch (error) {
        console.error('Error fetching faculty or subject data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (student) {
      fetchFacultiesAndSubjects();
    }
  }, [student]);

  const renderFaculty = ({ item }) => (
    <TouchableOpacity onPress={() => { 
      setSelectedFaculty(item); 
      setModalVisible(true); 
    }}>
      <Image 
        source={{ uri: item.staff_pic }} 
        style={styles.circleImage} 
      />
    </TouchableOpacity>
  );

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredAllFaculties = faculties.filter(faculty => 
    faculty.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSendEmail = (professorEmail) => {
    const subject = 'Message from Student';
    const body = ''; // You can set a default message body if needed
    const emailUrl = `mailto:${professorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl).catch((err) => {
      Alert.alert('Error', 'Unable to open email app.');
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Your Teachers Section */}
      <View style={styles.teachersContainer}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkSectionTitle : styles.lightSectionTitle]}>Your Teachers</Text>
        <FlatList
          data={filteredFaculties}
          renderItem={renderFaculty}
          keyExtractor={(item) => item.staff_id}
          horizontal
          ListEmptyComponent={<Text style={isDarkMode ? styles.darkEmptyText : styles.lightEmptyText}>No teachers found.</Text>}
        />
      </View>

      {/* All Faculty Members Section */}
      <View style={styles.facultyContainer}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.darkSectionTitle : styles.lightSectionTitle]}>All Faculty Members</Text>
        <TextInput
          style={[styles.searchBar, isDarkMode ? styles.darkSearchBar : styles.lightSearchBar]}
          placeholder="Search for faculty..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <FlatList
          data={filteredAllFaculties}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.facultyCard, isDarkMode ? styles.darkFacultyCard : styles.lightFacultyCard]} onPress={() => { 
              setSelectedFaculty(item); 
              setModalVisible(true); 
            }}>
              <Image 
                source={{ uri: item.staff_pic }} 
                style={styles.facultyImage} 
              />
              <Text style={[styles.facultyName, isDarkMode ? styles.darkFacultyName : styles.lightFacultyName]}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.staff_id}
          ListEmptyComponent={<Text style={isDarkMode ? styles.darkEmptyText : styles.lightEmptyText}>No faculty members found.</Text>}
        />
      </View>

      {/* Modal for faculty details and schedule */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkModalContent : styles.lightModalContent]}>
            {selectedFaculty && (
              <>
                <Image 
                  source={{ uri: selectedFaculty.staff_pic }} 
                  style={styles.modalImage} 
                />
                <Text style={[styles.modalTitle, isDarkMode ? styles.darkModalTitle : styles.lightModalTitle]}>{selectedFaculty.name}</Text>
                <Text style={[styles.modalDetails, isDarkMode ? styles.darkModalDetails : styles.lightModalDetails]}>{selectedFaculty.department}</Text>
                <Text style={[styles.modalDetails, isDarkMode ? styles.darkModalDetails : styles.lightModalDetails]}>Campus: {selectedFaculty.Campus}</Text>
                <Text style={[styles.modalDetails, isDarkMode ? styles.darkModalDetails : styles.lightModalDetails]}>Email: {selectedFaculty.email}</Text>

                {/* Schedule Section */}
                <View style={styles.scheduleContainer}>
                  <Text style={[styles.scheduleTitle, isDarkMode ? styles.darkScheduleTitle : styles.lightScheduleTitle]}>Available Schedule</Text>
                  <View style={styles.scheduleRow}>
                    <Text style={[styles.scheduleTime, isDarkMode ? styles.darkScheduleTime : styles.lightScheduleTime]}>9:00 AM - 9:30 AM</Text>
                  </View>
                  {/* Add other available times similarly */}
                </View>

                {/* Chat Box */}
                <View style={styles.chatBox}>
                  <Text style={[styles.chatBoxTitle, isDarkMode ? styles.darkChatBoxTitle : styles.lightChatBoxTitle]}>Chat</Text>
                  <TouchableOpacity 
                    style={styles.sendEmailButton}
                    onPress={() => handleSendEmail(selectedFaculty.email)}
                  >
                    <Text style={styles.sendEmailButtonText}>Send Message</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212', // Dark background for dark mode
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  lightSectionTitle: {
    color: '#000', // Light mode text color
  },
  darkSectionTitle: {
    color: '#fff', // Dark mode text color
  },
  teachersContainer: {
    marginBottom: 10,
  },
  facultyContainer: {
    marginTop: 10,
  },
  circleImage: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1b4768',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  darkSearchBar: {
    borderColor: '#555', // Dark mode border color
    backgroundColor: '#333', // Dark mode background color
    color: '#fff', // Dark mode text color
  },
  lightSearchBar: {
    backgroundColor: '#fff', // Light mode background color
    color: '#000', // Light mode text color
  },
  facultyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
  },
  darkFacultyCard: {
    backgroundColor: '#1e1e1e', // Dark mode background color for faculty cards
  },
  lightFacultyCard: {
    backgroundColor: '#f9f9f9', // Light mode background color for faculty cards
  },
  facultyImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1b4768',
    marginRight: 10,
  },
  facultyName: {
    fontSize: 18,
    flex: 1,
  },
  darkFacultyName: {
    color: '#fff', // Dark mode text color
  },
  lightFacultyName: {
    color: '#000', // Light mode text color
  },
  modalOverlay: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 40,
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  darkModalContent: {
    backgroundColor: '#2b2b2b', // Dark mode background color for modal
  },
  lightModalContent: {
    backgroundColor: 'white', // Light mode background color for modal
  },
  closeButtonText: {
    marginTop: 10,
    backgroundColor: '#406882',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    fontWeight: 'bold',
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#1b4768',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  darkModalTitle: {
    color: '#fff', // Dark mode title color
  },
  lightModalTitle: {
    color: '#000', // Light mode title color
  },
  modalDetails: {
    fontSize: 16,
    marginBottom: 5,
  },
  darkModalDetails: {
    color: '#fff', // Dark mode detail color
  },
  lightModalDetails: {
    color: '#000', // Light mode detail color
  },
  scheduleContainer: {
    marginVertical: 20,
    width: '100%',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  darkScheduleTitle: {
    color: '#fff', // Dark mode schedule title color
  },
  lightScheduleTitle: {
    color: '#000', // Light mode schedule title color
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  darkScheduleTime: {
    color: '#fff', // Dark mode schedule time color
  },
  lightScheduleTime: {
    color: '#000', // Light mode schedule time color
  },
  chatBox: {
    width: '100%',
    marginVertical: 20,
    marginTop: 20, // Ensure consistent margin
    padding: 15, // Add padding for better appearance
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc', // Default border color
    backgroundColor: '#f9f9f9', // Light background for better visibility
},
darkChatBox: {
    borderColor: '#555', // Dark mode border color
    backgroundColor: '#1e1e1e', // Dark mode background color for chat box
},
chatBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
},
darkChatBoxTitle: {
    color: '#fff', // Dark mode chat box title color
},
lightChatBoxTitle: {
    color: '#000', // Light mode chat box title color
},
chatInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
},
darkChatInput: {
    borderColor: '#555', // Dark mode chat input border color
    backgroundColor: '#333', // Dark mode chat input background color
    color: '#fff', // Dark mode chat input text color
},
lightChatInput: {
    borderColor: '#ccc', // Light mode chat input border color
    backgroundColor: '#fff', // Light mode chat input background color
    color: '#000', // Light mode chat input text color
},
darkEmptyText: {
    color: '#fff', // Dark mode empty text color
},
lightEmptyText: {
    color: '#000', // Light mode empty text color
},
});

export default FacultyDetails;