export type NutritionalNeeds = {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  
  export const calculateBMR = (weight: number, height: number, age: number): number => {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  };
  
  export const calculateNutritionalNeeds = (bmr: number): NutritionalNeeds => {
    const calories = bmr * 1.2;
    const protein = (calories * 0.15) / 4;
    const fat = (calories * 0.25) / 9;
    const carbs = (calories * 0.6) / 4;
    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
    };
  };
  