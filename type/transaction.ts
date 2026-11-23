export interface ITransaction {
    _id: string;
    appointmentId: string;
    customerId: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    status: "paid" | "failed";
    createdAt: string;
}