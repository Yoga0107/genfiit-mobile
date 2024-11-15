export const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };
  
  export const getNutritionalStatus = (bmi: number): string => {
    if (bmi < 17.0) {
      return 'Kurus';
    } else if (bmi >= 17.0 && bmi <= 18.4) {
      return 'Kurus';
    } else if (bmi >= 18.5 && bmi <= 25.0) {
      return 'Normal';
    } else if (bmi >= 25.1 && bmi <= 27.0) {
      return 'Gemuk';
    } else {
      return 'Gemuk';
    }
  };
  

export const getNutritionalIndex = (bmi: number): { bmi: number; nutritionalIndex: number } => {
  let nutritionalIndex;

  if (bmi < 17.0) {
    nutritionalIndex = 1; // Severe underweight
  } else if (bmi >= 17.0 && bmi <= 18.4) {
    nutritionalIndex = 2; // Underweight
  } else if (bmi >= 18.5 && bmi <= 25.0) {
    nutritionalIndex = 3; // Normal weight
  } else if (bmi >= 25.1 && bmi <= 27.0) {
    nutritionalIndex = 4; // Overweight
  } else {
    nutritionalIndex = 5; // Obese
  }

  return { bmi, nutritionalIndex };
};