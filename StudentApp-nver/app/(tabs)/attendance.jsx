import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper'; 
import { useTheme } from '../../context/ThemeContext';
import LoadingScreen from '../../components/loading';
import { getAttendanceDistributionForStudent, getCurrentUser } from '../../lib/appwrite';

const Attendance = () => {
  const { isDarkMode } = useTheme(); 
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDays, setTotalDays] = useState(0); 
  const [daysAttended, setDaysAttended] = useState(0);
  const [daysAbsent, setDaysAbsent] = useState(0);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const currentUser = await getCurrentUser(); 
        if (currentUser) {
          const distribution = await getAttendanceDistributionForStudent(currentUser.registerNumber);

          // Calculate total days, days attended, and days absent while ignoring invalid subjects
          let totalDays = 0;
          let attendedDays = 0;
          let absentDays = 0;

          const validAttendanceData = distribution.filter(subject => {
            return subject.totalHoursConducted && subject.hoursAttended !== undefined && subject.hoursAbsent !== undefined;
          });

          validAttendanceData.forEach(subject => {
            totalDays += subject.totalHoursConducted;
            attendedDays += subject.hoursAttended;
            absentDays += subject.hoursAbsent;
          });

          setAttendanceData(validAttendanceData);
          setTotalDays(totalDays);
          setDaysAttended(attendedDays);
          setDaysAbsent(absentDays);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  const attendancePercentage = totalDays ? ((daysAttended / totalDays) * 100).toFixed(2) : 0;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      <View style={[styles.summaryCard, themeStyles.card]}>
        <Text style={[styles.title, themeStyles.text]}>Attendance Summary</Text>
        <Text style={[styles.totalDays, themeStyles.text]}>Total Days: {totalDays}</Text>

        <ProgressBar progress={attendancePercentage / 100} color="#fcbf49" style={styles.progressBar} />
        <Text style={[styles.percentage, themeStyles.text]}>{attendancePercentage}%</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailTitle, themeStyles.text]}>Days Attended</Text>
            <Text style={[styles.detailValue, themeStyles.text]}>{daysAttended}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={[styles.detailTitle, themeStyles.text]}>Days Absent</Text>
            <Text style={[styles.detailValue, themeStyles.text]}>{daysAbsent}</Text>
          </View>
        </View>
      </View>

      {attendanceData.length > 0 && (
        <View style={styles.attendanceTable}>
          <Text style={[styles.tableTitle, themeStyles.text, { color: 'black' }]}>Attendance Breakdown by Subject</Text>


          {attendanceData.map((subject, index) => (
            <View key={index} style={[styles.tableRow, themeStyles.row]}>
              <Text style={[styles.tableCell, themeStyles.text, { width: '50%' }]}>{subject.subject_name}</Text>
              <Text style={[styles.tableCell, themeStyles.text, { width: '20%' }]}>
                {subject.hoursAttended}/{subject.totalHoursConducted}
              </Text>
              <Text style={[styles.tableCell, themeStyles.text, { width: '10%' }]}>{subject.hoursAbsent}</Text>
              <Text style={[styles.tableCell, themeStyles.text, { width: '20%' }]}>
                {subject.attendancePercentage.toFixed(2)}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Base styles
// Base styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    width: Dimensions.get('window').width * 0.9,
    padding: 20,
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalDays: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  percentage: {
    fontSize: 16,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  attendanceTable: {
    marginTop: 20,
    borderRadius: 10,  // Rounded corners for the entire table
    overflow: 'hidden', // Ensures child elements respect the parent's border radius
    backgroundColor: '#f7f7f7', // Light background for the table
    elevation: 3, // For shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black', // Ensure the title is black
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Thin line to separate rows
  },
  tableCell: {
    fontSize: 14,
    textAlign: 'left',
    color: '#333', // Dark text for readability
  },
  subjectName: {
    width: '50%',
    fontWeight: 'bold',
    color: '#1b4769', // Accent color for subject names
  },
  attendanceValues: {
    width: '20%',
  },
  absentDays: {
    width: '10%',
    color: '#e74c3c', // Red for absent days
  },
  percentageCell: {
    width: '20%',
    fontWeight: 'bold',
    color: '#2ecc71', // Green for the percentage
  },
});


// Light mode styles
const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#1b4769',
  },
  text: {
    color: '#fff',
  },
  row: {
    backgroundColor: '#1b4769',
  },
});

// Dark mode styles
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
  },
  card: {
    backgroundColor: '#555', // Darker background for the card
  },
  text: {
    color: '#fff',
  },
  row: {
    backgroundColor: '#444',
  },
});

export default Attendance;
