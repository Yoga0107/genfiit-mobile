export interface Option {
    id: number;
    title: string;
    answer: boolean;
  }
  
  export interface Question {
    id: number;
    title: string;
    options: Option[];
  }
  
  /**
   * Parse questions from the material data.
   * @param data - The material data that contains questions.
   * @returns An array of Question objects.
   */
  export const parseQuestions = (data: any): Question[] => {
    if (!data.questions || !Array.isArray(data.questions)) {
      return [];
    }
  
    return data.questions.map((question: any) => ({
      id: question.id,
      title: question.title,
      options: question.item.map((option: any) => ({
        id: option.id,
        title: option.title,
        answer: option.answer,
      })),
    }));
  };
  
  /**
   * Get the correct answer from the options.
   * @param options - An array of options.
   * @returns The correct option if found.
   */
  export const getCorrectAnswer = (options: Option[]): Option | null => {
    return options.find(option => option.answer) || null;
  };
  