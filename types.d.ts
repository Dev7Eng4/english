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
