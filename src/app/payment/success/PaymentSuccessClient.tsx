
import Link from "next/link";

const PaymentSuccessClient = () => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-lg border border-gray-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center bg-green-50 text-4xl text-green-600">
                    ✓
                </div>

                <h1 className="mt-6 text-3xl font-bold text-gray-900">
                    Payment Successful!
                </h1>

                <p className="mt-3 leading-7 text-gray-500">
                    Your payment has been completed successfully through
                    Stripe. Your appointment payment status will be
                    updated after our secure payment confirmation process.
                    Thank you for booking with SalonBook.
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
