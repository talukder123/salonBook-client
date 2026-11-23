
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

interface SuccessPageProps {
    searchParams: Promise<{
        session_id?: string;
    }>;
}

const SuccessPage = async ({ searchParams }: SuccessPageProps) => {
    const { session_id } = await searchParams;

    if (!session_id) {
        redirect("/dashboard/my-appointments");
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.status === "open") {
        redirect("/dashboard/my-appointments");
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

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center bg-green-50 text-4xl text-green-600">
                    ✓
                </div>

                <h1 className="mt-6 text-3xl font-bold text-gray-900">
                    Payment Successful!
                </h1>

                <p className="mt-3 text-gray-500">
                    Thank you for booking with SalonBook.
                    Your payment has been received successfully.
                </p>

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

export default SuccessPage;
