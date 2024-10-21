import React, { useState, useEffect, useRef } from 'react';
import {KeyboardAvoidingView,StyleSheet,Text,View,FlatList,ScrollView,TouchableOpacity,TextInput,ActivityIndicator,Animated,Dimensions,Platform,useColorScheme} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { getCurrentUser, fetchAnnouncements, database,getOverallAttendancePercentage  } from '../../lib/appwrite';
import { Query } from 'react-native-appwrite'; // Ensure correct path and import
import Loading from '../../components/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

export default function HomePage({ navigation }) {
  const { height, width } = Dimensions.get('window');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [userName, setUserName] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(0);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [subjectsMap, setSubjectsMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  const { isDarkMode } = useTheme(); // Get dark mode flag from theme context
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        setUserName(user?.name || 'Student');
        setStudent(user);
  
        const announcementsData = await fetchAnnouncements();
        setAnnouncements(announcementsData.slice(0, 3));
  
        // Fetch timetable
        const timetableResponse = await database.listDocuments(
          'christDatabase',
          'timetable',
          [
            Query.equal('course_id', user.course_id),
            Query.equal('section', user.section),
            Query.equal('semester', parseInt(user.semester, 10))
          ]
        );
        setTimetable(timetableResponse.documents);
  
        // Fetch subjects and map { subject_id: subject_name }
        const subjectsResponse = await database.listDocuments(
          'christDatabase',
          'subjects',
          [Query.equal('course_id', user.course_id)]
        );
  
        const subjectMap = subjectsResponse.documents.reduce((map, subject) => {
          map[subject.subject_id] = subject.name;
          return map;
        }, {});
  
        setSubjectsMap(subjectMap);
  
        // Filter today's classes
        const today = selectedDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
        const todaysClasses = timetableResponse.documents.filter(
          (item) => item.day.toLowerCase() === today
        );
        setFilteredTimetable(todaysClasses);
  
        const attendanceData = await getOverallAttendancePercentage(user.$id);
        setAttendance(attendanceData?.overallAttendancePercentage || 0); // Set attendance state here
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();

      }
    };
  
    fetchData();
  }, [selectedDate]);  

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await AsyncStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    };

    loadNotes();
  }, []);

  const saveNotes = async (newNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const addNote = () => {
    if (note.trim()) {
      const newNotes = [...notes, note];
      setNotes(newNotes);
      saveNotes(newNotes); // Save to AsyncStorage
      setNote('');
    }
  };

  const editNote = () => {
    if (note.trim() && editingIndex !== null) {
      const newNotes = [...notes];
      newNotes[editingIndex] = note;
      setNotes(newNotes);
      saveNotes(newNotes); // Save to AsyncStorage
      setNote('');
      setEditingIndex(null); // Clear editing state
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNote(notes[index]);
  };

  const handleDelete = (index) => {
    const newNotes = notes.filter((_, idx) => idx !== index);
    setNotes(newNotes);
    saveNotes(newNotes); // Save to AsyncStorage
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index); // Set the active index to the first visible item
    }
  }).current;
  
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item must be at least 50% visible
  }).current;
  
  
  const Dots = ({ data, activeIndex }) => (
    <View style={styles.dotsContainer}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: activeIndex === index ? '#1b4769' : '#E4E4E4' },
          ]}
        />
      ))}
    </View>
  );
  
  const renderAnnouncement = ({ item }) => (
    <TouchableOpacity
      style={[styles.announcementCard, { width: width-20, height: height * 0.15 }]} // Use full width here
      onPress={() => navigation.navigate('announcementDetails', { announcementId: item.$id })}
    >
      <Text style={styles.announcementTitle}>{item.title}</Text>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.announcementDescription}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );
  
  
  const renderClass = ({ item }) => (
    <View style={styles.classItem}>
      <View style={styles.classRow}>
        <Text style={styles.className}>{subjectsMap[item.subject_id] || 'Unknown'}</Text>
        <Text style={styles.classDetails}>
          {item.subject_id} - Slot: {item.slot}
        </Text>
      </View>
    </View>
  );
  
  const handleNavigation = (section) => {
    navigation.navigate(section);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.welcomeTextBold}>{userName}!</Text>
          </Animated.View>
        </View>

        <View style={styles.attendanceContainer}>
          <Text style={styles.sectionTitle}>Total Attendance</Text>
          <View style={styles.attendanceCircle}>
            <Text style={styles.attendanceText}>{attendance}%</Text>
          </View>
        </View>


        <View style={styles.carouselContainer}>
        <FlatList
  data={announcements}
  keyExtractor={(item) => item.$id}
  renderItem={renderAnnouncement}
  horizontal
  showsHorizontalScrollIndicator={false}
  pagingEnabled
  snapToAlignment="center"  // Ensures items snap to the center
  snapToInterval={width}    // Ensure each item takes the full width of the screen
  decelerationRate="fast"   // Makes the snapping feel smoother
  onMomentumScrollEnd={(event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveIndex(currentIndex);
  }}
  viewabilityConfig={viewabilityConfig}
  onViewableItemsChanged={onViewableItemsChanged}
/>
<Dots data={announcements} activeIndex={activeIndex} />

</View>


        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          {filteredTimetable.length > 0 ? (
            <FlatList
              data={filteredTimetable}
              keyExtractor={(item) => item.$id}
              renderItem={renderClass}
            />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No classes today.
            </Text>
          )}
        </View>

        <View style={styles.shortcutsContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.shortcutsRow}>
            <TouchableOpacity
              style={styles.shortcutButton}
              onPress={() => handleNavigation('announcements')}
            >
              <Ionicons name="megaphone-outline" size={30} color="#FFF" />
              <Text style={styles.shortcutText}>Updates</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shortcutButton}
              onPress={() => handleNavigation('timetable')}
            >
              <Ionicons name="calendar-outline" size={30} color="#FFF" />
              <Text style={styles.shortcutText}>Timetable</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shortcutButton}
              onPress={() => handleNavigation('settings')}
            >
              <Ionicons name="settings-outline" size={30} color="#FFF" />
              <Text style={styles.shortcutText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.noteInputContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Write a note..."
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity onPress={editingIndex !== null ? editNote : addNote}>
              <AntDesign name="pluscircle" size={24} color="#1b4769" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={notes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.noteItem}>
                <Text style={styles.note}>{item}</Text>
                <View style={styles.noteActions}>
                  <TouchableOpacity onPress={() => handleEdit(index)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(index)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: isDarkMode ? '#1c1c1e' : '#F8F9FB' 
    },
    header: {
      backgroundColor: isDarkMode ? '#2c2c2e' : '#1b4769',
      paddingVertical: 40,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    welcomeText: { 
      fontSize: 24, 
      color: isDarkMode ? '#A5A5A5' : '#E4E4E4' 
    },
    welcomeTextBold: { 
      fontSize: 36, 
      fontWeight: 'bold', 
      color: isDarkMode ? '#fff' : '#FFF' 
    },
    attendanceContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    attendanceCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 6,
      borderColor: isDarkMode ? '#A5A5A5' : '#1b4769',
      alignItems: 'center',
      justifyContent: 'center',
    },
    attendanceText: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      color: isDarkMode ? '#A5A5A5' : '#1b4769' 
    },
    carouselContainer: { marginTop: 10, paddingHorizontal: 10 },
    announcementCard: {
      backgroundColor: isDarkMode ? '#2c2c2e' : '#FFF',
      borderRadius: 15,
      padding: 20,
      marginHorizontal: 10,
      elevation: 3,
    },
    announcementTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign:'center',
      color: isDarkMode ? '#FFF' : '#000',
    },
    announcementDescription: {
      fontSize: 14,
      textAlign:'center',
      paddingTop: 15,
      color: isDarkMode ? '#A5A5A5' : '#333',
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: isDarkMode ? '#A5A5A5' : '#1b4769',
      marginHorizontal: 5,
    },
    classItem: {
      padding: 10,
      marginVertical: 5,
      backgroundColor: isDarkMode ? '#2c2c2e' : '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    classRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    className: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#333',
      flex: 1, 
    },
    classDetails: {
      fontSize: 14,
      color: isDarkMode ? '#A5A5A5' : 'grey',
    },
    greyText: {
      fontSize: 12,
      color: isDarkMode ? '#A5A5A5' : 'grey',
    },
    sectionContainer: { marginTop: 20, paddingHorizontal: 20 },
    sectionTitle: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      marginBottom: 10, 
      color: isDarkMode ? '#fff' : '#000' 
    },
    shortcutsContainer: { marginTop: 20, paddingHorizontal: 20 },
    shortcutsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    shortcutButton: {
      flex: 1,
      backgroundColor: isDarkMode ? '#2c2c2e' : '#1b4769',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    shortcutText: { 
      color: '#FFF', 
      fontWeight: 'bold', 
      marginTop: 5 
    },
    notesContainer: { marginTop: 20, paddingHorizontal: 20 },
    noteInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    noteInput: {
      flex: 1,
      borderBottomWidth: 1,
      borderColor: isDarkMode ? '#A5A5A5' : '#1b4769',
      color: isDarkMode ? '#fff' : '#000',
      marginRight: 10,
      padding: 5,
    },
    noteText: {
      marginVertical: 5,
      padding: 10,
      backgroundColor: isDarkMode ? '#3a3a3c' : '#E4E4E4',
      borderRadius: 5,
      color: isDarkMode ? '#fff' : '#000',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noteItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 5,
      padding: 10,
      backgroundColor: isDarkMode ? '#3a3a3c' : '#f9f9f9',
      borderRadius: 5,
    },
    noteActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editText: {
      color: isDarkMode ? '#A5A5A5' : '#1b4769',
      marginRight: 10,
    },
    deleteText: {
      color: 'red',
    },
});