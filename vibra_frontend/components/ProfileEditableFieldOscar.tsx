import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

interface EditableProfileFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}

const EditableProfileField: React.FC<EditableProfileFieldProps> = ({ label, value, onSave }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleSave = async () => {
    try {
      await onSave(inputValue);  // Call the parent save handler
    } catch (error) {
      console.error('Error saving field:', error);
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <TextInput
        style={{ 
            color: 'black',   // Ensure the text color is visible
            backgroundColor: 'white',  // Ensure background color contrasts
            padding: 10,
            borderRadius: 5
          }}
        value={inputValue}
        onChangeText={setInputValue}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    flex: 1,
    marginRight: 10,
  },
});

export default EditableProfileField;
