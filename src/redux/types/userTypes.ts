export interface User {
    id: number;
    username: string;
    role: string;
    departmentId: number | null;
    isglobalrole: boolean;
    wecom_userid?: string | null;
    canAccess: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
  }


  // UserInput type: only fields needed when creating
export interface UserInput {
  username: string;
  password: string;
  role: string;
  departmentId?: number;
  canAccess?: string[];
  isglobalrole?: boolean;
}