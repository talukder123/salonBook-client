
"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface PayNowButtonProps {
    appointmentId: string;
    amount: number;
}

const PayNowButton = ({ appointmentId, amount }: PayNowButtonProps) => {
    const [paying, setPaying] = useState(false);

    const handlePayment = async () => {
        try {
            setPaying(true);

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Please login to continue.");
            }

            const response = await fetch("/api/checkout_sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ appointmentId }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Checkout failed.");
            }

            if (!result.url) {
                throw new Error("Stripe Checkout URL not found.");
            }

            window.location.href = result.url;
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Payment failed."
            );
            setPaying(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={paying}
            className="w-full flex items-center justify-center gap-2 bg-[#000099] text-white py-4 hover:bg-blue-900 disabled:opacity-60 transition-colors"
        >
            {paying ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <CreditCard size={20} />
                    Pay ৳{amount.toLocaleString("en-BD")}
                </>
            )}
        </button>
    );
};

export default PayNowButton;
