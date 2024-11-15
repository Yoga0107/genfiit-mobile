// nutritionCalculator.ts

interface NutritionalNeeds {
    protein: number;       // grams per day
    fat: number;           // grams per day
    carbohydrates: number; // grams per day
  }
  
  export function calculateNutritionalNeeds(weight: number, height: number): NutritionalNeeds {
    // Use the Mifflin-St Jeor Equation for Basal Metabolic Rate (BMR) as an example.
    const bmr = 10 * weight + 6.25 * height - 5 * 25 + 5; // Assumes age of 25 and male gender
  
    // Estimated daily energy needs (example: 1.55 for moderately active)
    const dailyCalories = bmr * 1.55;
  
    // Macronutrient distribution in grams (typical balanced macros: 50% carbs, 20% protein, 30% fat)
    const carbohydrates = (dailyCalories * 0.50) / 4;  // 4 calories per gram of carbohydrates
    const protein = (dailyCalories * 0.20) / 4;        // 4 calories per gram of protein
    const fat = (dailyCalories * 0.30) / 9;            // 9 calories per gram of fat
  
    return {
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbohydrates: Math.round(carbohydrates),
    };
  }
  