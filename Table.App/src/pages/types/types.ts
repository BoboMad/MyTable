type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    createdAt: Date;
    description: string;
  };

  type Status = {
    value: number | string;
    label: string
  }

  export type { Payment, Status };