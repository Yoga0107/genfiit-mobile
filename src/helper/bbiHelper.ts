// helper/bbiHelper.ts

export const calculateBBI = (height: number, gender: string): number => {
    let bbi;

    if (gender === 'male') {
      // Formula for male
      bbi = (height - 100) - ((height - 100) * 0.1);
    } else if (gender === 'female') {
      // Formula for female
      bbi = (height - 100) - ((height - 100) * 0.15);
    } else {
      throw new Error("Gender must be 'male' or 'female'");
    }
  
    return bbi;
};
