type Payment = {
    id: number;
    email: string;
    amount: number;
    statusId: number
    creationDate: string;
    expirationDate: string;
    description: string;
  };

  type Status = {
    id:number;
    name:string;
  }
  
  // type Status = "pending" | "processing" | "success" | "failed";

  // enum Status {
  //   pending= 1,
  //   processing=2,
  //   success=3,
  //   failed=4,
  // }

  export type { Payment, Status };