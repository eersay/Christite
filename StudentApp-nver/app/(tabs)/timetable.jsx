import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { database } from '../../lib/appwrite'; // Ensure to import your database setup
import Loading from '../../components/loading';
import { WebView } from 'react-native-webview';
import { getCurrentUser } from '../../lib/appwrite'; // Import the function to get the current user
import { Query } from 'react-native-appwrite';
import { useTheme } from '../../context/ThemeContext'; // Import the useTheme hook


const Timetable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekdays, setWeekdays] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { isDarkMode, themeColors } = useTheme();


  useEffect(() => {
    const fetchStudentData = async () => {
      const currentStudent = await getCurrentUser(); // Use the getCurrentUser function
      if (currentStudent) {
        setStudent(currentStudent);
      } else {
        console.error('No student found with the current session');
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    if (!student) return;

    const fetchData = async () => {
      try {
        const timetableResponse = await database.listDocuments(
          'christDatabase',
          'timetable',
          [
            Query.equal('course_id', student.course_id),
            Query.equal('section', student.section),
            Query.equal('semester', student.semester)
          ]
        );
        setTimetable(timetableResponse.documents);

        const subjectsResponse = await database.listDocuments(
          'christDatabase',
          'subjects',
          [
            Query.equal('course_id', student.course_id),
            Query.equal('semester', student.semester)
          ]
        );
        setSubjects(subjectsResponse.documents);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching timetable or subjects:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [student]);

  useEffect(() => {
    if (!timetable.length) return;

    const selectedDay = selectedDate.toLocaleDateString('en', { weekday: 'long' });
    const filtered = timetable.filter(entry => entry.day === selectedDay);
    setFilteredTimetable(filtered);
  }, [selectedDate, timetable]);

  useEffect(() => {
    const generateWeekdays = () => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(selectedDate.getDate() - selectedDate.getDay() + i);
        days.push({ day: date.toLocaleDateString('en', { weekday: 'short' }), date: date.getDate() });
      }
      setWeekdays(days);
    };
    generateWeekdays();
  }, [selectedDate]);

  // Function to reset the selected date to today's date
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((sub) => sub.subject_id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getSubjectPlan = (subjectId) => {
    const subject = subjects.find((sub) => sub.subject_id === subjectId);
    return subject ? subject.plan : null;
  };

  const handleSubjectClick = (subjectId) => {
    const pdfUrl = getSubjectPlan(subjectId);
    if (pdfUrl) {
      const embeddedPdfUrl = 'https://docs.google.com/gview?embedded=true&url=${pdfUrl}';
      setSelectedPdfUrl(embeddedPdfUrl);
      setModalVisible(true);
    }
  };

  const renderSubject = ({ item }) => (
    <TouchableOpacity onPress={() => handleSubjectClick(item.subject_id)}>
      <View style={styles.subjectBox}>
        <Text style={styles.subjectName}>{item.name}</Text>
        <Text style={styles.subjectDescription}>{item.subject_id}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTimetable = ({ item }) => (
    <View style={styles.timetableRow}>
      <View style={styles.slotColumn}>
        <Text style={styles.timetableSlot}>Slot {item.slot}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.detailsColumn}>
        <Text style={styles.timetableSubject}>
          {getSubjectName(item.subject_id) || 'Unknown Subject'}
        </Text>
        <Text style={styles.subjectDescription}>
          {item.subject_id ? 'Detailed subject info here' : 'No details available'}
        </Text>
      </View>
    </View>
  );

  const renderDateHeader = () => {
    return (
      <View style={styles.dateHeader}>
        <View style={styles.dateInfo}>
          {/* Display the large date */}
          <Text style={styles.largeDate}>{selectedDate.getDate()}</Text>
          <View>
            {/* Display the day of the week and month-year */}
            <Text style={styles.dayOfWeek}>{selectedDate.toLocaleDateString('en', { weekday: 'short' })}</Text>
            <Text style={styles.monthYear}>{selectedDate.toLocaleDateString('en', { month: 'short', year: 'numeric' })}</Text>
          </View>
        </View>

        {/* Button to reset to the current date */}
        <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
          <Text style={styles.todayText}>Today</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Render Date Header */}
      {renderDateHeader()}

      {/* Subjects Section */}
      <View style={styles.subjectsContainer}>
        <Text style={styles.sectionTitle}>Subjects</Text>
        <FlatList
          data={subjects}
          renderItem={renderSubject}
          keyExtractor={(item) => item.subject_id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Weekdays Section */}
      <View style={styles.weekdays}>
        {weekdays.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDate(new Date(new Date().setDate(day.date)))}
            style={[styles.dayBox, selectedDate.getDate() === day.date ? styles.activeDay : null]}
          >
            <Text style={[styles.dayText, selectedDate.getDate() === day.date ? styles.selectedDayText : null]}>
              {day.day}
            </Text>
            <Text style={[styles.dateText, selectedDate.getDate() === day.date ? styles.selectedDayText : null]}>
              {day.date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timetable Section */}
      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>Timetable</Text>
        <FlatList
          data={filteredTimetable}
          renderItem={renderTimetable}
          keyExtractor={(item) => item.$id}
          ListEmptyComponent={<Text>No timetable available for this day.</Text>}
        />
      </View>

      {/* Modal for PDF View */}
      {selectedPdfUrl && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <WebView
            source={{ uri: selectedPdfUrl }}
            onError={() => console.error('Error loading PDF')}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default Timetable;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0EF',
    padding: 20,
  },
  /* Subjects Section */
  subjectsContainer: {
    marginBottom: 10, // Space between subjects and schedule sections
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subjectBox: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    width: 200, // Fixed width
    height: 150, // Fixed height
    minHeight: 100,
    flexShrink: 0,
    overflow: 'hidden',
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#406882',
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.5, // Shadow transparency
    shadowRadius: 3.84, // Shadow blur radius (iOS)
    elevation: 5,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subjectDescription: {
    fontSize: 12,
    color: '#A5A5A5',
  },
 
  /* Schedule Section */
  scheduleContainer: {
    marginTop: 10, // Space between subject boxes and schedule title
  },
  scheduleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeDate: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 10,
  },
  dayOfWeek: {
    fontSize: 16,
    fontWeight: '600',
  },
  monthYear: {
    fontSize: 12,
    color: '#A5A5A5',
  },
  todayButton: {
    padding: 8,
    backgroundColor: '#D2A46D',
    borderRadius: 8,
  },
  todayText: {
    color: '#fff',
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayBox: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: 50,
  },
  activeDay: {
    backgroundColor: '#406882',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#fff', // Change to white when selected
  },
  timetableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  slotColumn: {
    width: 70, // Fixed width for the slot column
  },
  timetableSlot: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsColumn: {
    flex: 1, // Take up the remaining space
  },
  timetableSubject: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    width: 5,
    backgroundColor: '#406882', // Color of the separator
    marginRight: 10,
    marginLeft: -10,
    height: '160%', // Make it full height
  },
  closeButton: { position: 'absolute', top: 20, right: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  closeButtonText: { color: '#fff', fontSize: 16 },
});