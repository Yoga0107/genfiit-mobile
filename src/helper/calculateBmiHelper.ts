type BMIData = {
    "-3SD": number;
    "-2SD": number;
    "-1SD": number;
    median: number;
    "+1SD": number;
    "+2SD": number;
    "+3SD": number;
  };
  
  type ReferenceBMIData = {
    boys: Record<number, BMIData>;
    girls: Record<number, BMIData>;
    adults: Record<number, BMIData>; 
  };
  
  const referenceBMIData: ReferenceBMIData = {
    boys: {
        1: { "-3SD": 13.5, "-2SD": 14.4, "-1SD": 15.2, median: 16.0, "+1SD": 16.9, "+2SD": 17.8, "+3SD": 18.7 },
        2: { "-3SD": 14.1, "-2SD": 15.0, "-1SD": 16.0, median: 17.0, "+1SD": 18.0, "+2SD": 19.1, "+3SD": 20.2 },
        3: { "-3SD": 14.6, "-2SD": 15.5, "-1SD": 16.5, median: 17.5, "+1SD": 18.5, "+2SD": 19.6, "+3SD": 20.7 },
        4: { "-3SD": 15.0, "-2SD": 16.0, "-1SD": 17.0, median: 18.0, "+1SD": 19.0, "+2SD": 20.2, "+3SD": 21.3 },
        5: { "-3SD": 15.3, "-2SD": 16.3, "-1SD": 17.4, median: 18.4, "+1SD": 19.5, "+2SD": 20.7, "+3SD": 21.9 },
        6: { "-3SD": 15.7, "-2SD": 16.7, "-1SD": 17.8, median: 18.8, "+1SD": 19.9, "+2SD": 21.1, "+3SD": 22.3 },
        7: { "-3SD": 16.0, "-2SD": 17.1, "-1SD": 18.2, median: 19.2, "+1SD": 20.4, "+2SD": 21.6, "+3SD": 22.8 },
        8: { "-3SD": 16.4, "-2SD": 17.5, "-1SD": 18.6, median: 19.7, "+1SD": 20.9, "+2SD": 22.1, "+3SD": 23.3 },
        9: { "-3SD": 16.7, "-2SD": 17.8, "-1SD": 18.9, median: 20.0, "+1SD": 21.2, "+2SD": 22.4, "+3SD": 23.6 },
        10: { "-3SD": 17.1, "-2SD": 18.2, "-1SD": 19.3, median: 20.4, "+1SD": 21.6, "+2SD": 22.8, "+3SD": 24.0 },
        11: { "-3SD": 17.5, "-2SD": 18.6, "-1SD": 19.7, median: 20.8, "+1SD": 22.0, "+2SD": 23.2, "+3SD": 24.4 },
        12: { "-3SD": 17.8, "-2SD": 18.9, "-1SD": 20.0, median: 21.1, "+1SD": 22.3, "+2SD": 23.5, "+3SD": 24.7 },
        13: { "-3SD": 18.2, "-2SD": 19.3, "-1SD": 20.4, median: 21.5, "+1SD": 22.7, "+2SD": 23.9, "+3SD": 25.1 },
        14: { "-3SD": 18.5, "-2SD": 19.6, "-1SD": 20.7, median: 21.8, "+1SD": 23.0, "+2SD": 24.2, "+3SD": 25.4 },
        15: { "-3SD": 18.8, "-2SD": 19.9, "-1SD": 21.0, median: 22.1, "+1SD": 23.3, "+2SD": 24.5, "+3SD": 25.7 },
        16: { "-3SD": 19.1, "-2SD": 20.2, "-1SD": 21.3, median: 22.4, "+1SD": 23.6, "+2SD": 24.8, "+3SD": 26.0 },
        17: { "-3SD": 19.4, "-2SD": 20.5, "-1SD": 21.6, median: 22.7, "+1SD": 23.9, "+2SD": 25.1, "+3SD": 26.3 },
        18: { "-3SD": 19.7, "-2SD": 20.8, "-1SD": 21.9, median: 23.0, "+1SD": 24.2, "+2SD": 25.4, "+3SD": 26.6 },
      19: { "-3SD": 18.5, "-2SD": 19.5, "-1SD": 20.5, median: 22.0, "+1SD": 23.5, "+2SD": 25.0, "+3SD": 26.5 },
  
      // Mulai dari usia 19 dan tambah 1 setiap tahun
      ...Array.from({ length: 81 }, (_, index) => {
        const age = 20 + index; // usia mulai dari 20
        return {
          [age]: { 
            "-3SD": 18.5, 
            "-2SD": 19.5, 
            "-1SD": 20.5, 
            median: 22.0, 
            "+1SD": 23.5, 
            "+2SD": 25.0, 
            "+3SD": 26.5 
          }
        };
      }).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    },
  
    girls: {
        1: { "-3SD": 13.3, "-2SD": 14.2, "-1SD": 15.1, median: 15.9, "+1SD": 16.8, "+2SD": 17.7, "+3SD": 18.6 },
        2: { "-3SD": 13.9, "-2SD": 14.8, "-1SD": 15.8, median: 16.8, "+1SD": 17.8, "+2SD": 18.9, "+3SD": 20.0 },
        3: { "-3SD": 14.4, "-2SD": 15.3, "-1SD": 16.3, median: 17.3, "+1SD": 18.3, "+2SD": 19.4, "+3SD": 20.5 },
        4: { "-3SD": 14.8, "-2SD": 15.8, "-1SD": 16.8, median: 17.8, "+1SD": 18.9, "+2SD": 20.0, "+3SD": 21.1 },
        5: { "-3SD": 15.2, "-2SD": 16.2, "-1SD": 17.3, median: 18.3, "+1SD": 19.4, "+2SD": 20.5, "+3SD": 21.6 },
        6: { "-3SD": 15.6, "-2SD": 16.6, "-1SD": 17.7, median: 18.7, "+1SD": 19.8, "+2SD": 20.9, "+3SD": 22.0 },
        7: { "-3SD": 16.0, "-2SD": 17.0, "-1SD": 18.1, median: 19.1, "+1SD": 20.2, "+2SD": 21.3, "+3SD": 22.4 },
        8: { "-3SD": 16.3, "-2SD": 17.3, "-1SD": 18.4, median: 19.4, "+1SD": 20.5, "+2SD": 21.6, "+3SD": 22.7 },
        9: { "-3SD": 16.7, "-2SD": 17.7, "-1SD": 18.8, median: 19.8, "+1SD": 20.9, "+2SD": 22.0, "+3SD": 23.1 },
        10: { "-3SD": 17.1, "-2SD": 18.1, "-1SD": 19.2, median: 20.2, "+1SD": 21.3, "+2SD": 22.4, "+3SD": 23.5 },
        11: { "-3SD": 17.5, "-2SD": 18.5, "-1SD": 19.6, median: 20.6, "+1SD": 21.7, "+2SD": 22.8, "+3SD": 23.9 },
        12: { "-3SD": 17.8, "-2SD": 18.8, "-1SD": 19.9, median: 20.9, "+1SD": 22.0, "+2SD": 23.1, "+3SD": 24.2 },
        13: { "-3SD": 18.2, "-2SD": 19.2, "-1SD": 20.3, median: 21.3, "+1SD": 22.4, "+2SD": 23.5, "+3SD": 24.6 },
        14: { "-3SD": 18.5, "-2SD": 19.5, "-1SD": 20.6, median: 21.6, "+1SD": 22.7, "+2SD": 23.8, "+3SD": 24.9 },
        15: { "-3SD": 18.8, "-2SD": 19.8, "-1SD": 20.9, median: 21.9, "+1SD": 23.0, "+2SD": 24.1, "+3SD": 25.2 },
        16: { "-3SD": 19.1, "-2SD": 20.1, "-1SD": 21.2, median: 22.2, "+1SD": 23.3, "+2SD": 24.4, "+3SD": 25.5 },
        17: { "-3SD": 19.4, "-2SD": 20.4, "-1SD": 21.5, median: 22.5, "+1SD": 23.6, "+2SD": 24.7, "+3SD": 25.8 },
        18: { "-3SD": 19.7, "-2SD": 20.7, "-1SD": 21.8, median: 22.8, "+1SD": 23.9, "+2SD": 25.0, "+3SD": 26.1 },
     
  
      19: { "-3SD": 18.5, "-2SD": 19.5, "-1SD": 20.5, median: 22.0, "+1SD": 23.5, "+2SD": 25.0, "+3SD": 26.5 },
  
      // Mulai dari usia 19 dan tambah 1 setiap tahun
      ...Array.from({ length: 81 }, (_, index) => {
        const age = 20 + index; // usia mulai dari 20
        return {
          [age]: { 
            "-3SD": 18.5, 
            "-2SD": 19.5, 
            "-1SD": 20.5, 
            median: 22.0, 
            "+1SD": 23.5, 
            "+2SD": 25.0, 
            "+3SD": 26.5 
          }
        };
      }).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    },
  
    adults: {
      19: { "-3SD": 18.5, "-2SD": 19.5, "-1SD": 20.5, median: 22.0, "+1SD": 23.5, "+2SD": 25.0, "+3SD": 26.5 },
      // Mulai dari usia 19 dan tambah 1 setiap tahun
      ...Array.from({ length: 81 }, (_, index) => {
        const age = 20 + index; // usia mulai dari 20
        return {
          [age]: { 
            "-3SD": 18.5, 
            "-2SD": 19.5, 
            "-1SD": 20.5, 
            median: 22.0, 
            "+1SD": 23.5, 
            "+2SD": 25.0, 
            "+3SD": 26.5 
          }
        };
      }).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    },
  };
  
  
  export const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };
  
  export const getBMICategory = (
    bmi: number,
    age: number,
    gender: "boys" | "girls" | "adults"
  ): string => {
    let ageData;
  
    // Handle children/adolescent data
    if (gender === "boys" || gender === "girls") {
      const genderData = referenceBMIData[gender];
      ageData = genderData[age];
      if (!ageData) return "Age data not available";
      if (bmi < ageData["-3SD"]) return "Severely underweight";
      if (bmi >= ageData["-3SD"] && bmi < ageData["-2SD"]) return "Moderately underweight";
      if (bmi >= ageData["-2SD"] && bmi < ageData["-1SD"]) return "Mildly underweight";
      if (bmi >= ageData["-1SD"] && bmi <= ageData["+1SD"]) return "Normal weight";
      if (bmi > ageData["+1SD"] && bmi <= ageData["+2SD"]) return "Overweight";
      if (bmi > ageData["+2SD"]) return "Obese";
    }
  
    // Handle adult data (for age 19 and above)
    if (gender === "adults") {
      const adultData = referenceBMIData.adults[99]; // Use same data for all ages 19-99
      if (bmi < adultData["-2SD"]) return "Underweight";
      if (bmi >= adultData["-2SD"] && bmi <= adultData["+1SD"]) return "Normal weight";
      if (bmi > adultData["+1SD"] && bmi <= adultData["+2SD"]) return "Overweight";
      if (bmi > adultData["+2SD"]) return "Obese";
    }
  
    return "Category not defined";
  };
  