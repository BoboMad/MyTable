type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    createdAt: Date;
    description: string;
  };

  export type { Payment };