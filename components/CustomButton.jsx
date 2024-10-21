import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
      style={[
        styles.defaultButton, // Default button styles
        containerStyles, // Override container styles from props
        isLoading && styles.disabledButton, // Apply opacity when loading
      ]}
    >
      <Text
        style={[
          styles.defaultButtonText, // Default text styles
          textStyles, // Override text styles from props
        ]}
      >
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator animating={isLoading} color="#fff" size="small" />
      )}
    </TouchableOpacity>
  );
};

// Define the styles with StyleSheet, directly embedding the color values
const styles = StyleSheet.create({
  defaultButton: {
    backgroundColor: '#201E1E', // blackPantone
    borderColor: '#4A4A4A', // grayDark
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row", // Replace flex-row from Tailwind
  },
  disabledButton: {
    opacity: 0.5, // Replace Tailwind's opacity-50 when loading
  },
  defaultButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
