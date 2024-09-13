import { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false); // Default is hidden

  return (
    <View style={[styles.formField, otherStyles]}>
      <Text>{title}</Text>

      <View style={{ position: 'relative' }}>
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword} // Toggled visibility
          style={styles.input} // Add some input styling if needed
          {...props}
        />

        {/* Only show the eye icon for password fields */}
        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)} // Toggle state
            style={styles.eyeIconContainer}
          >
            <Image
              source={showPassword ? icons.eyeHide : icons.eye} // Toggle the icon based on state
              style={styles.eyeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  formField: {
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#1C2E4A',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,  // Adjust to fit your input height
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#000', // Black tint for the eye icon
  },
});
