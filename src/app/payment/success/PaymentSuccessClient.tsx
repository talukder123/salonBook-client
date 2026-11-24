
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface PaymentSuccessClientProps {
    sessionId: string;
}

const PaymentSuccessClient = ({
    sessionId,
}: PaymentSuccessClientProps) => {
    const [status, setStatus] = useState<
        "loading" | "success" | "error"
    >("loading");

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const tokenResponse = await authClient.token();
                const token = tokenResponse.data?.token;

                if (!token) {
                    throw new Error("Please login to verify your payment.");
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/payment/checkout-verify`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ sessionId }),
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Payment verification failed."
                    );
                }

                setStatus("success");
            } catch (error) {
                console.error("Payment Verification Error:", error);
                setStatus("error");
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-lg border border-gray-200 bg-white p-8 text-center shadow-sm">

                {status === "loading" && (
                    <>
                        <div className="mx-auto h-12 w-12 animate-spin border-4 border-gray-200 border-t-[#000099]" />
                        <h1 className="mt-6 text-2xl font-bold text-gray-900">
                            Verifying Payment...
                        </h1>
                        <p className="mt-3 text-gray-500">
                            Please wait while we verify your payment.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto flex h-20 w-20 items-center justify-center bg-green-50 text-4xl text-green-600">
                            ✓
                        </div>

                        <h1 className="mt-6 text-3xl font-bold text-gray-900">
                            Payment Successful!
                        </h1>

                        <p className="mt-3 text-gray-500">
                            Your payment has been verified successfully.
                            Thank you for booking with SalonBook.
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1 className="text-2xl font-bold text-red-600">
                            Verification Failed
                        </h1>

                        <p className="mt-3 text-gray-500">
                            We could not verify your payment right now.
                            Please check your appointment before trying again.
                        </p>
                    </>
                )}

                <a
                    href="/dashboard/user/my-appointment"
                    className="mt-8 inline-block bg-[#000099] px-6 py-3 font-semibold text-white"
                >
                    View My Appointments
                </a>
            </div>
        </main>
    );
};

export default PaymentSuccessClient;
