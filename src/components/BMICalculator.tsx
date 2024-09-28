import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // height in meters
    const w = parseFloat(weight);
    const bmiValue = w / (h * h);
    setBmi(bmiValue);
    if (bmiValue < 18.5) setCategory('Underweight');
    else if (bmiValue < 24.9) setCategory('Normal');
    else if (bmiValue < 29.9) setCategory('Overweight');
    else setCategory('Obese');
  };

  return (
    <View>
      <TextInput placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
      <TextInput placeholder="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" />
      <Button title="Calculate BMI" onPress={calculateBMI} />
      {bmi && (
        <View>
          <Text>Your BMI: {bmi.toFixed(2)}</Text>
          <Text>Category: {category}</Text>
        </View>
      )}
    </View>
  );
};

export default BMICalculator;
