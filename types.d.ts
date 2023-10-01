type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type Output = {
  id: number;
  kind_of_error: string;
  revised_sentence: string;
  status: boolean;
  text: string;
};

type ResponseText = {
  id: number;
  kind_of_error: string[];
  revised_sentence: string;
  status: string;
  text: string;
};

interface ILevel {
  id: string;
  label: string;
  description?: string;
  isDefault?: boolean;
}

interface ISetting {
  id: string;
  key: 'audience' | 'formality' | 'domain' | 'intent';
  type: string;
  label: string;
  isPremium?: boolean;
  description?: string;
  levels: ILevel[];
}
