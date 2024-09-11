import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
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
      style={{
        borderColor: colors.grayDark,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Text
        className={`text-white font-timesNewRomanBold text-2xl ${textStyles}`}
        style={{
          marginRight: isLoading ? 8 : 0, // Adds space if loading indicator is present
        }}
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

export default CustomButton;
