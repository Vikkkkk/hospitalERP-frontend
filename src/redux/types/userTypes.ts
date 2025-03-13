export interface User {
    id: number;
    username: string;
    role: string;
    departmentId: number | null;
    isglobalrole: boolean;
    wecom_userid?: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
  }