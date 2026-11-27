
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

    const [message, setMessage] = useState(
        "Verifying your payment..."
    );

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const { data: tokenData } = await authClient.token();

                if (!tokenData?.token) {
                    throw new Error("Authentication required. Please log in.");
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/payment/checkout-verify`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${tokenData.token}`,
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
                setMessage(
                    result.message || "Your payment has been verified successfully."
                );
            } catch (error) {
                setStatus("error");
                setMessage(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while verifying payment."
                );
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-lg border border-gray-200 bg-white p-8 text-center shadow-sm">

                {status === "loading" && (
                    <>
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#000099]" />
                        <h1 className="mt-6 text-2xl font-bold text-gray-900">
                            Verifying Payment...
                        </h1>
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
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto flex h-20 w-20 items-center justify-center bg-red-50 text-4xl text-red-600">
                            !
                        </div>

                        <h1 className="mt-6 text-2xl font-bold text-red-600">
                            Payment Verification Failed
                        </h1>
                    </>
                )}

                <p className="mt-3 leading-7 text-gray-500">
                    {message}
                </p>

                <Link
                    href="/dashboard/user/my-appointment"
                    className="mt-8 inline-block bg-[#000099] px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-900"
                >
                    View My Appointments
                </Link>
            </div>
        </main>
    );
};

export default PaymentSuccessClient;