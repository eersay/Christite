// LoadingScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const dot4 = useRef(new Animated.Value(0)).current;
  const dot5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDots(dot1, 0);
    animateDots(dot2, 100);
    animateDots(dot3, 200);
    animateDots(dot4, 300);
    animateDots(dot5, 400);
  }, [dot1, dot2, dot3, dot4, dot5]);

  return (
    <View style={styles.container}>
      <View style={styles.dotContainer}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        <Animated.View style={[styles.dot, { opacity: dot4 }]} />
        <Animated.View style={[styles.dot, { opacity: dot5 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centers vertically on screen
    alignItems: 'center',      // Centers horizontally on screen
    backgroundColor: '#F2F0EF', // Optional: Add a background color
  },
  dotContainer: {
    flexDirection: 'row', // Ensures dots are displayed in a row
    justifyContent: 'center', // Centers the dots horizontally within this view
    alignItems: 'center',     // Centers the dots vertically within this view
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#1b4769', // Customize your dot color
    marginHorizontal: 5,        // Adds spacing between the dots
  },
});

export default LoadingScreen;
