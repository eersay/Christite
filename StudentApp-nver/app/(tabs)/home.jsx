import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons

export default function HomePage({ navigation }) {
  const { height, width } = Dimensions.get('window'); // Get the window width for carousel
  const carouselRef = useRef(null); // Ref for carousel
  const [currentIndex, setCurrentIndex] = useState(0); // Track current index for carousel dots

  const carouselItems = [
    {
      title: "Announcement 1",
      description: "Exam schedule will be released soon.",
    },
    {
      title: "Announcement 2",
      description: "New courses available for next semester.",
    },
    {
      title: "Announcement 3",
      description: "Don't forget to submit your assignments!",
    },
  ];

  const renderCarouselItem = ({ item, index }) => (
    <View style={[styles.carouselItem, { width: width * 0.85 }]}>
      <Text style={styles.carouselTitle}>{item.title}</Text>
      <Text style={styles.carouselDescription}>{item.description}</Text>
    </View>
  );

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Background Shape */}
      <View style={[styles.backgroundShape, { height: height * 0.5 }]} />

      {/* Welcome Heading */}
      <Text style={styles.welcomeText}>Welcome,</Text>
      <Text style={styles.welcomeTextt}>Bhagyasree!</Text>

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          data={carouselItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCarouselItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          ref={carouselRef}
          snapToAlignment="center"
          decelerationRate="fast"
        />
      </View>

      {/* Carousel Dots */}
      <View style={styles.dotsContainer}>
        {carouselItems.map((_, index) => (
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
      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('Announcements')} // Navigate to the Announcement screen
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.cardText}>Announcements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="calendar-outline" size={24} color="#333" />
          <Text style={styles.cardText}>My Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="book-outline" size={24} color="#333" />
          <Text style={styles.cardText}>Assignments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="checkbox-outline" size={24} color="#333" />
          <Text style={styles.cardText}>Exams</Text>
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
    shadowTop: {
      width: 0,
      height: -10, // Negative height value to move shadow to the top
    }
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
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 12,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#F2F0EF'
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
});
