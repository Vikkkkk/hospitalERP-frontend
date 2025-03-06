// src/types/User.ts
export interface User {
    id: number;
    username: string;
    role: string;
    departmentid?: number | null;
    isglobalrole?: boolean;
    wecom_userid?:string;
  }
  