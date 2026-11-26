
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import PaymentSuccessClient from "./PaymentSuccessClient";

interface SuccessPageProps {
    searchParams: Promise<{
        session_id?: string;
    }>;
}

const SuccessPage = async ({ searchParams }: SuccessPageProps) => {
    const { session_id } = await searchParams;

    if (!session_id) {
        redirect("/dashboard/user/my-appointment");
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.status === "open") {
        redirect("/dashboard/user/my-appointment");
    }

    if (session.payment_status !== "paid") {
        return (
            <main className="flex min-h-screen items-center justify-center px-4">
                <div className="max-w-md border border-red-200 bg-white p-8 text-center">
                    <h1 className="text-2xl font-bold text-red-600">
                        Payment Not Completed
                    </h1>
                    <p className="mt-3 text-gray-500">
                        Your payment could not be verified.
                    </p>
                </div>
            </main>
        );
    }

    return <PaymentSuccessClient sessionId={session_id} />;
};

export default SuccessPage;
