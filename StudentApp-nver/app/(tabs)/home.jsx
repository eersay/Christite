import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { getCurrentUser, fetchAnnouncements } from '../../lib/appwrite'; 

export default function HomePage({ navigation }) {
  const { height, width } = Dimensions.get('window'); 
  const carouselRef = useRef(null); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userName, setUserName] = useState(''); 
  const [announcements, setAnnouncements] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserName(user.name); 
        }

        const allAnnouncements = await fetchAnnouncements(); 
        const topThreeAnnouncements = allAnnouncements.slice(0, 3);
        setAnnouncements(topThreeAnnouncements);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const renderCarouselItem = ({ item, index }) => (
    <View key={item.$id} style={[styles.carouselItem, { width: width * 0.85 }]}>
      <Text style={styles.carouselTitle}>{item.title}</Text>
      <Text style={styles.carouselDescription}>{item.description}</Text>
    </View>
  );

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1b4769" />
      </View>
    );
  }

  if (error) {

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Background Shape */}
      <View style={[styles.backgroundShape, { height: height * 0.5 }]} />

      {/* Welcome Heading */}
      <Text style={styles.welcomeText}>Welcome,</Text>
      <Text style={styles.welcomeTextt}>{userName ? userName : 'Student'}!</Text> 

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        {announcements.length > 0 ? (
          <FlatList
            data={announcements}
            keyExtractor={(item) => item.$id} 
            renderItem={renderCarouselItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            ref={carouselRef}
            snapToAlignment="center"
            decelerationRate="fast"
          />
        ) : (
          <Text style={styles.noAnnouncementsText}>No announcements available.</Text>
        )}
      </View>

      {/* Carousel Dots */}
      <View style={styles.dotsContainer}>
        {announcements.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Top Bar with Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>08</Text>
          <Text style={styles.statLabel}>Exams</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>02</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
      </View>

      {/* Today's Timeline Section */}
      <View style={styles.timelineContainer}>
        <Text style={styles.sectionTitle}>Today's Timeline</Text>
        <View style={styles.timelineItem}>
          <View style={styles.timelineText}>
            <Text style={styles.className}>CS4521 - Operating Systems</Text>
            <Text style={styles.classDetails}>4:00 - 5:30PM | Room 501</Text>
          </View>
          <Text style={styles.statusOngoing}>ONGOING CLASS</Text>
        </View>
        <View style={styles.timelineItem}>
          <View style={styles.timelineText}>
            <Text style={styles.className}>CS2915 - Web Development</Text>
            <Text style={styles.classDetails}>4:40 - 6:00PM | Room 503</Text>
          </View>
          <Text style={styles.statusUpcoming}>UPCOMING</Text>
        </View>
      </View>

      {/* Feature Cards */}
        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          {/* Attendance Card */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('attendance')} // Navigate to the Attendance screen
          >
            <Ionicons name="clipboard-outline" size={24} color="#333" />
            <Text style={styles.cardText}>Attendance</Text>
          </TouchableOpacity>

          {/* My Calendar Card */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('timetable')} // Navigate to the Timetable screen
          >
            <Ionicons name="calendar-outline" size={24} color="#333" />
            <Text style={styles.cardText}>My Timetable</Text>
          </TouchableOpacity>

          {/* Student Support Card */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('support')}
          >
            <Ionicons name="help-circle-outline" size={24} color="#333" />
            <Text style={styles.cardText}>Student Support</Text>
          </TouchableOpacity>

          {/* Marks Card */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('marks')} // Navigate to the Marks screen
          >
            <Ionicons name="checkbox-outline" size={24} color="#333" />
            <Text style={styles.cardText}>Marks</Text>
          </TouchableOpacity>
        </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0EF',
  },
  // Background Shape
  backgroundShape: {
    position: 'absolute',
    width: '100%',
    marginTop:'2%',
    backgroundColor: '#1b4769', // Purple color similar to the image
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    top: 240,
    height: '100%', // Adjust the height to make sure it ends before the "Today's Timeline" section
    zIndex: -1,
    shadowColor: '#000',
    shadowOpacity: 0.8, // Reduced opacity for a smoother effect
    shadowOffset: { width: 0, height: 2 }, // Default shadow below
    shadowRadius: 10, // To make the shadow softer
    elevation: 5, // Optional for Android to provide more shadow effect
    // Removed 'shadowTop' as it's not a valid style property
  },
  
  // Welcome Text
  welcomeText: {
    fontSize: 22,
    marginTop: 20,
    textAlign: 'left',
    paddingLeft: 30,
    color: '#808080',
  },
  welcomeTextt: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 30,
  },
  // Carousel
  carouselContainer: {
    marginTop: 20,
    marginLeft:'7.5%',
    marginRight:'7.5%',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 }, // Light shadow for the container
    shadowRadius: 8, // Softer shadow around the edges
    elevation: 4, // For Android devices
    borderRadius: 15,
  },
  
  carouselItem: {
    backgroundColor: '#fff',
    borderRadius: 15, // More rounded corners for smoother shadow
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0, // Increase opacity for more pronounced shadow
    shadowOffset: { width: 0, height: 5 }, // More depth for the shadow below the item
    shadowRadius: 10, // Soften the shadow edges
    elevation: 8, // For 3D effect on Android
  },
  
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  carouselDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  // Carousel Dots
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#1b4769',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  // Top Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
    paddingLeft: '7.5%',
    paddingRight: '7.5%',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30, // Increased padding for larger boxes
    borderRadius: 15, // Slightly increased border radius for more rounded corners
    width: '47%', // Increased width of the boxes
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  statNumber: {
    fontSize: 30, // Increased font size for numbers
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 16, // Increased font size for labels
    color: '#666',
  },  
  // Timeline Section
  timelineContainer: {
    marginBottom: 30,
    paddingLeft: '7.5%',
    paddingRight: '7.5%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#F2F0EF',
  },
  timelineItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classDetails: {
    fontSize: 14,
    color: '#666',
  },
  statusOngoing: {
    backgroundColor: 'red',
    color: '#fff',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 5,
    fontSize: 12,
    marginLeft:3,
  },
  statusUpcoming: {
    backgroundColor: '#1b4769',
    color: '#fff',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 12,
  },
  // Feature Cards
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingLeft: '7.5%',
    paddingRight: '7.5%',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  // Loading and Error Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noAnnouncementsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});
