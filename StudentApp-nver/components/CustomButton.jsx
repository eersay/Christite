import { ActivityIndicator, Text, TouchableOpacity, StyleSheet  } from "react-native";
import tailwindConfig from "../tailwind.config";

const { colors } = tailwindConfig.theme.extend;

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
      className={`bg-blackPantone rounded-xl min-h-[50px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
      style={[
        styles.defaultButton, // Default button styles
        containerStyles, // Override container styles from props
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
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultButton: {
    backgroundColor: colors.blackPantone,
    borderColor: colors.grayDark,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    
  },
  defaultButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
