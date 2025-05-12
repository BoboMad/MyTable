type Payment = {
    id: string;
    email: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    creationDate: Date;
    expirationDate: Date;
    description: string;
  };

  type Status = {
    value: number | string;
    label: string
  }

  export type { Payment, Status };