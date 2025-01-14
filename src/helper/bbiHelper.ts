export const calculateBBI = (height: number, gender: string): number => {
  if (gender !== 'male' && gender !== 'female') {
      throw new Error("Gender must be 'male' or 'female'");
  }

  // general Formula
  const baseBBI = height - 100;
  const reduction = baseBBI * 0.1; 
  const bbi = baseBBI - reduction;

  return bbi;
};
