export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getNutritionalStatus = (bmi: number): string => {
  if (bmi < 17.0) {
    return 'Underweight';
  } else if (bmi >= 17.0 && bmi <= 18.4) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi <= 25.0) {
    return 'Normal';
  } else if (bmi >= 25.1 && bmi <= 27.0) {
    return 'Overweight';
  } else {
    return 'Overweight';
  }
};

export const getNutritionalIndex = (bmi: number): { bmi: number; nutritionalIndex: number } => {
  let nutritionalIndex;

  if (bmi < 17.0) {
    nutritionalIndex = 1;
  } else if (bmi >= 17.0 && bmi <= 18.4) {
    nutritionalIndex = 2;
  } else if (bmi >= 18.5 && bmi <= 25.0) {
    nutritionalIndex = 3;
  } else if (bmi >= 25.1 && bmi <= 27.0) {
    nutritionalIndex = 4;
  } else {
    nutritionalIndex = 5;
  }

  return { bmi, nutritionalIndex };
};

export const calculateIdealWeight = (height: number, idealBMI: number = 21.9): number => {
  const heightInMeters = height / 100;
  return Math.round(idealBMI * heightInMeters * heightInMeters);
};
