export interface Question {
  id: number;
  type: string;
  question: string;
  options: string[];
  correct: number;
}

export const questions: Question[] = [
  {
    id: 1,
    type: 'Sentence Arrangement',
    question: 'Which arrangement forms the most logical and grammatically correct sentence?',
    options: [
      'The quickly fox brown jumped over the lazy dog',
      'The quick brown fox jumped over the lazy dog',
      'Jumped the quick fox over brown the dog lazy',
      'Over the lazy dog the quick brown fox jumped quickly',
    ],
    correct: 1,
  },
  {
    id: 2,
    type: 'Text Classification',
    question: 'Which category best describes this text: "The quarterly revenue grew by 23% due to increased product adoption in East Africa."',
    options: ['Sports News', 'Business/Finance', 'Entertainment', 'Health & Wellness'],
    correct: 1,
  },
  {
    id: 3,
    type: 'Spelling Check',
    question: 'Identify the correctly spelled word:',
    options: ['Accomodation', 'Acommodation', 'Accommodation', 'Acomodation'],
    correct: 2,
  },
  {
    id: 4,
    type: 'Pattern Completion',
    question: 'Complete the pattern: 2, 6, 18, 54, ___',
    options: ['108', '162', '72', '216'],
    correct: 1,
  },
  {
    id: 5,
    type: 'Sentiment Labeling',
    question: 'What is the sentiment of: "Despite the challenges, our team delivered an outstanding result that exceeded all expectations!"',
    options: ['Negative', 'Neutral', 'Mixed', 'Positive'],
    correct: 3,
  },
];
