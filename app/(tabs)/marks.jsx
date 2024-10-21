import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Dimensions } from 'react-native';
import { database } from '../../lib/appwrite'; // Your database setup
import { Query } from 'react-native-appwrite';
import { getCurrentUser } from '../../lib/appwrite'; // Your function to get current user
import { Circle, G, Svg, Text as SvgText } from 'react-native-svg'; // Import necessary components for the doughnut chart
import Loading from '../../components/loading'; // Your custom loading component
import { useColorScheme } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const DoughnutChart = ({ percentage, totalMarks, obtainedMarks, size }) => {
  const strokeWidth = 10; // Width of the stroke
  const radius = size / 2 - strokeWidth; // Calculate radius
  const circumference = 2 * Math.PI * radius; // Calculate circumference of the circle
  const progress = (obtainedMarks / totalMarks) * circumference; // Calculate progress based on marks

  return (
    <View style={styles.chartContainer}>
      <Svg height={size} width={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba( 173, 255, 47, 1 )" // Light color for remaining marks
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Foreground circle representing progress */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#fac048" // Green for obtained marks
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress}, ${circumference}`}
            fill="transparent"
          />
        </G>

        {/* Percentage text in the center */}
        <SvgText
          x={size / 2}
          y={size / 2 + 5}
          fill="#808080"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
        >
          {percentage}%
        </SvgText>
      </Svg>
    </View>
  );
};

const MarksComponent = () => {
  const { isDarkMode } = useTheme(); // Get theme mode
  const [student, setStudent] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      const currentStudent = await getCurrentUser();
      if (currentStudent) {
        setStudent(currentStudent);
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  useEffect(() => {
    const fetchMarksData = async () => {
      if (student) {
        setLoading(true);
        const marksResponse = await database.listDocuments(
          'christDatabase',
          'marks',
          [Query.equal('registerNumber', student.registerNumber)]
        );
        if (marksResponse.documents.length > 0) {
          setMarksData(marksResponse.documents[0]); // Assuming one record per student
        }
        setLoading(false);
      }
    };

    if (student) {
      fetchMarksData();
    }
  }, [student]);

  if (loading) {
    return <Loading/>;
  }

  if (!marksData || !marksData.subject_id || marksData.subject_id.length === 0) {
    return <Text>No subjects available</Text>;
  }

  const handleSubjectClick = (index) => {
    setSelectedSubject({
      subject_id: marksData.subject_id[index],
      CIA_1: marksData.CIA_1[index] || 0,
      midSem: marksData.midSem[index] || 0,
      CIA_3: marksData.CIA_3[index] || 0,
    });
    setModalVisible(true);
  };

  const renderSubjectCard = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleSubjectClick(index)} style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.subjectText, isDarkMode ? styles.subjectTextDark : styles.subjectTextLight]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Display subjects */}
      <FlatList
        data={marksData.subject_id}
        renderItem={renderSubjectCard}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Two columns for subjects
        columnWrapperStyle={styles.columnWrapper} // Apply styles to each row
      />

      {/* Modal for displaying selected subject details */}
      {selectedSubject && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={[styles.modalContainer, isDarkMode ? styles.darkModalContainer : styles.lightModalContainer]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.modalTitleDark : styles.modalTitleLight]}>
              {selectedSubject.subject_id}
            </Text>

            {/* Marks Sections */}
            <MarksDetail
              label="CIA-1"
              marks={selectedSubject.CIA_1}
              total={20}
              isDarkMode={isDarkMode}
            />
            <MarksDetail
              label="Midsem"
              marks={selectedSubject.midSem}
              total={50}
              isDarkMode={isDarkMode}
            />
            <MarksDetail
              label="CIA-3"
              marks={selectedSubject.CIA_3}
              total={20}
              isDarkMode={isDarkMode}
            />

            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.closeButton, isDarkMode ? styles.darkCloseButton : styles.lightCloseButton]}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Marks Detail Component
const MarksDetail = ({ label, marks, total, isDarkMode }) => (
  <View style={[styles.marksSection, isDarkMode ? styles.darkMarksSection : styles.lightMarksSection]}>
    <Text style={[styles.marksLabel, isDarkMode ? styles.marksLabelDark : styles.marksLabelLight]}>
      {label} Marks: {marks}/{total}
    </Text>
    <DoughnutChart
      percentage={((marks / total) * 100).toFixed(0)}
      totalMarks={total}
      obtainedMarks={marks}
      size={100} // Adjust size of the chart
      isDarkMode={isDarkMode} // Pass isDarkMode prop
    />
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent:'space-around',
  },
  lightContainer: {
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  columnWrapper: {
    justifyContent: 'space-between', // Distribute space evenly between columns
    paddingHorizontal: 10, // Optional horizontal padding for spacing
  },
  card: {
    backgroundColor: '#1b4768',
    marginVertical: 8, // Vertical margin between cards
    padding: '20%', // Adjust padding as necessary
    borderRadius: 8,
    width: '49%', // Make the card width less than 50% of the available width
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  lightCard: {
    backgroundColor: '#1b4768',
  },
  darkCard: {
    backgroundColor: '#444',
  },
  subjectText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subjectTextLight: {
    color: '#eeeee4',
  },
  subjectTextDark: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lightModalContainer: {
    backgroundColor: '#f9f9f9',
  },
  darkModalContainer: {
    backgroundColor: '#1a1a1a',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalTitleLight: {
    color: '#1b4768',
  },
  modalTitleDark: {
    color: '#fff',
  },
  marksSection: {
    borderRadius: 12, // Rounded corners
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Space between text and chart
    alignItems: 'center', // Vertically center content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lightMarksSection: {
    backgroundColor: '#f9f9f9',
  },
  darkMarksSection: {
    backgroundColor: '#444',
  },
  marksLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1, // Takes up more space on the left
    paddingRight: 10, // Space between text and chart
  },
  marksLabelLight: {
    color: '#000000',
  },
  marksLabelDark: {
    color: '#fff',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightCloseButton: {
    backgroundColor: '#1b4768',
  },
  darkCloseButton: {
    backgroundColor: '#444',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

});

export default MarksComponent;