export const calculateBMR = (weight: number, height: number, dob: Date, gender: string) => {
  const age = new Date().getFullYear() - dob.getFullYear(); // Menghitung umur dari DOB

  // Menggunakan rumus Harris-Benedict untuk BMR
  let bmr: number;

  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  return bmr;
};

export const calculateMacronutrients = (bmr: number) => {
  // Menentukan persentase kalori yang berasal dari protein, lemak, dan karbohidrat
  const proteinPercentage = 0.20; // 20% dari kalori
  const fatPercentage = 0.25; // 25% dari kalori
  const carbPercentage = 0.55; // 55% dari kalori

  // Menghitung kalori untuk masing-masing makronutrien
  const proteinCalories = bmr * proteinPercentage;
  const fatCalories = bmr * fatPercentage;
  const carbCalories = bmr * carbPercentage;

  // Menghitung gram untuk masing-masing makronutrien (dengan asumsi 1g protein = 4 kalori, 1g lemak = 9 kalori, 1g karbohidrat = 4 kalori)
  const proteinGrams = proteinCalories / 4;
  const fatGrams = fatCalories / 9;
  const carbGrams = carbCalories / 4;

  return {
    proteinGrams,
    fatGrams,
    carbGrams,
  };
};
