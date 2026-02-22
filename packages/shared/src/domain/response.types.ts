export type Answer = {
    questionId: string;
    value: string | string[]; 
  };
  
  export type FormResponse = {
    id: string;
    formId: string;
    answers: Answer[];
    submittedAt: string; 
  };