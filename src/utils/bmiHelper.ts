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
  