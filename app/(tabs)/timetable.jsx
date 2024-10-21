import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { database } from '../../lib/appwrite';
import Loading from '../../components/loading';
import { WebView } from 'react-native-webview';
import { getCurrentUser } from '../../lib/appwrite';
import { Query } from 'react-native-appwrite';
import { useTheme } from '../../context/ThemeContext';

const Timetable = () => {
  const { isDarkMode } = useTheme(); // Destructuring isDarkMode from useTheme
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekdays, setWeekdays] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false); // Track PDF loading state

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
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    if (!student) return;

    const fetchData = async () => {
      try {
        const [timetableResponse, subjectsResponse] = await Promise.all([
          database.listDocuments('christDatabase', 'timetable', [
            Query.equal('course_id', student.course_id),
            Query.equal('section', student.section),
            Query.equal('semester', student.semester),
          ]),
          database.listDocuments('christDatabase', 'subjects', [
            Query.equal('course_id', student.course_id),
            Query.equal('semester', student.semester),
          ]),
        ]);

        setTimetable(timetableResponse.documents);
        setSubjects(subjectsResponse.documents);
      } catch (error) {
        console.error('Error fetching timetable or subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [student]);

  useEffect(() => {
    if (!timetable.length) return;

    const selectedDay = selectedDate.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
    const filtered = timetable.filter((entry) => entry.day.toLowerCase() === selectedDay);
    setFilteredTimetable(filtered);
  }, [selectedDate, timetable]);

  useEffect(() => {
    const generateWeekdays = () => {
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(selectedDate.getDate() - selectedDate.getDay() + i);
        return {
          day: date.toLocaleDateString('en', { weekday: 'short' }),
          date: date.getDate(),
        };
      });
      setWeekdays(days);
    };
    generateWeekdays();
  }, [selectedDate]);

  const goToToday = () => setSelectedDate(new Date());

  const getSubjectName = (subjectId) => subjects.find((sub) => sub.subject_id === subjectId)?.name || 'Unknown Subject';

  const getSubjectPlan = (subjectId) => subjects.find((sub) => sub.syllabus)?.syllabus || null;

  const handleSubjectClick = (subjectId) => {
    const pdfUrl = getSubjectPlan(subjectId);
    if (pdfUrl) {
      const embeddedPdfUrl = `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`;
      setSelectedPdfUrl(embeddedPdfUrl);
      setModalVisible(true);
      setPdfLoading(true);
    } else {
      console.log('No syllabus found for this subject');
    }
  };

  const renderSubject = ({ item }) => (
    <TouchableOpacity onPress={() => handleSubjectClick(item.subject_id)}>
      <View style={[styles.subjectBox, { backgroundColor: isDarkMode ? '#1C1C1E' : '#fff' }]}>
        <Text style={[styles.subjectName, { color: isDarkMode ? '#FFF' : '#000' }]}>{item.name}</Text>
        <Text style={styles.subjectDescription}>{item.subject_id}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTimetable = ({ item }) => (
    <View style={[styles.timetableRow, { backgroundColor: isDarkMode ? '#1C1C1E' : '#fff' }]}>
      <View style={styles.slotColumn}>
        <Text style={[styles.timetableSlot, { color: isDarkMode ? '#FFF' : '#000' }]}>Slot {item.slot}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.detailsColumn}>
        <Text style={[styles.timetableSubject, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {getSubjectName(item.subject_id)}
        </Text>
        <Text style={styles.subjectDescription}>Detailed subject info here</Text>
      </View>
    </View>
  );

  const renderDateHeader = () => (
    <View style={[styles.dateHeader, { backgroundColor: isDarkMode ? '#1C1C1E' : '#fff' }]}>
      <View style={styles.dateInfo}>
        <Text style={[styles.largeDate, { color: isDarkMode ? '#FFF' : '#000' }]}>{selectedDate.getDate()}</Text>
        <View>
          <Text style={[styles.dayOfWeek, { color: isDarkMode ? '#FFF' : '#000' }]}>
            {selectedDate.toLocaleDateString('en', { weekday: 'short' })}
          </Text>
          <Text style={[styles.monthYear, { color: isDarkMode ? '#A5A5A5' : '#000' }]}>
            {selectedDate.toLocaleDateString('en', { month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
        <Text style={styles.todayText}>Today</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F2F0EF' }]}>
      <View style={styles.subjectsContainer}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Subjects</Text>
        <FlatList
          data={subjects}
          renderItem={renderSubject}
          keyExtractor={(item) => item.subject_id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {renderDateHeader()}

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


      <View style={styles.scheduleContainer}>
        <Text style={[styles.scheduleTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Timetable</Text>
        <FlatList
          data={filteredTimetable}
          renderItem={renderTimetable}
          keyExtractor={(item) => item.$id}
          ListEmptyComponent={<Text style={[{ color: isDarkMode ? '#FFF' : '#000' }]}>No schedule available for today.</Text>}
          style={{ flexGrow: 1 }}
          scrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {selectedPdfUrl && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          {pdfLoading && <ActivityIndicator size="large" />}
          <WebView
            source={{ uri: selectedPdfUrl }}
            onLoad={() => setPdfLoading(false)}
            onError={() => console.error('PDF failed to load')}
            style={{ flex: 1 }}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
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
    marginTop: 5, // Space between subject boxes and schedule title
    flex: 1,
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
    fontSize: 11,
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
  closeButton: { position: 'absolute', top: 20, right: 20, backgroundColor: '#406882', padding: 10, borderRadius: 5 },
  closeButtonText: { color: '#fff', fontSize: 16 },
});