interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

interface FormData {
  id: number | string;
  duration: string;
  project_name: string;
  budget: string;
  started_date: string;
  status: string;
  end_date: string;
  completed: string;
  incomplete: string;
  user_id: User;
}

export default FormData;