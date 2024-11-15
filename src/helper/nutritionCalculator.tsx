interface NutritionalNeeds {
    protein: number;       
    fat: number;           
    carbohydrates: number; 
  }
  
  export function calculateNutritionalNeeds(weight: number, height: number): NutritionalNeeds {
    
    const bmr = 10 * weight + 6.25 * height - 5 * 25 + 5; 
  
    
    const dailyCalories = bmr * 1.55;
  
    
    const carbohydrates = (dailyCalories * 0.50) / 4;  
    const protein = (dailyCalories * 0.20) / 4;        
    const fat = (dailyCalories * 0.30) / 9;            
  
    return {
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbohydrates: Math.round(carbohydrates),
    };
  }
  