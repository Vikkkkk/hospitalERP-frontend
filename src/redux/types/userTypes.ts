export interface User {
  id: number;
  username: string;
  role: 'RootAdmin' | 'Admin' | 'DepartmentHead' | 'Staff';
  departmentId: number | null;
  isglobalrole: boolean;
  wecom_userid?: string | null;
  permissions: {
    [module: string]: {
      read: boolean;
      write: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// 📝 UserInput: For Create / Update
export interface UserInput {
  username: string;
  password: string;
  role: 'RootAdmin' | 'Admin' | 'DepartmentHead' | 'Staff';
  departmentId?: number | null;
  isglobalrole?: boolean;
  permissions: {
    [module: string]: {
      read: boolean;
      write: boolean;
    };
  };
}