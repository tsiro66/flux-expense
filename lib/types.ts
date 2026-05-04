export type TransactionType = "expense" | "income" | "payment";

export interface Profile {
  id: string;
  display_name: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  created_by: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  created_at: string;
  // Joined from profiles
  profiles?: Pick<Profile, "display_name"> | null;
}

export interface NetBalance {
  user_id: string;
  display_name: string;
  balance: number;
}
