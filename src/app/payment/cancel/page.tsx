import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

const PaymentCancelPage = () => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md border border-gray-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-red-50">
                    <XCircle size={38} className="text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                    Payment Cancelled
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    Your payment was not completed. No payment confirmation
                    has been recorded. You can return to your appointments
                    and try again.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    <Link
                        href="/dashboard/user/my-appointment"
                        className="flex items-center justify-center gap-2 bg-[#000099] px-5 py-3 font-medium text-white transition-colors hover:bg-blue-900"
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </Link>

                    <Link
                        href="/dashboard/user/my-appointment"
                        className="flex items-center justify-center gap-2 border border-gray-300 px-5 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <ArrowLeft size={18} />
                        Back to My Appointments
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default PaymentCancelPage;