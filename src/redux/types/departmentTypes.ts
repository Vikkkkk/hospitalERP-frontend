export interface Department {
    id: number;
    name: string;
    headId?: number | null; // Department head (if assigned)
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null; // ✅ Include soft deletion timestamp
  }