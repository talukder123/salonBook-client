
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    CalendarDays,
    Clock,
    UserRound,
    Loader2,
    ArrowLeft,
    ShieldCheck,
    CreditCard,
    Receipt,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import PayNowButton from "./PayNowButton";

interface IAppointment {
    _id: string;
    customer: {
        name: string;
        email: string;
    };
    appointmentDate: string;
    timeSlot: string;
    servicePrice: number;
    paymentStatus: string;
    status: string;
}

const CheckoutPage = () => {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("appointmentId");

    const [appointment, setAppointment] =
        useState<IAppointment | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                if (!appointmentId) {
                    throw new Error("Appointment ID is missing.");
                }

                const tokenResponse = await authClient.token();
                const token = tokenResponse.data?.token;

                if (!token) {
                    throw new Error("Please login to continue.");
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/my-appointments/${appointmentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        cache: "no-store",
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load appointment."
                    );
                }

                const data = result.appointment ?? result.data ?? result;

                setAppointment(data);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [appointmentId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#000099]" />
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
                <h2 className="text-xl font-semibold">
                    Appointment Not Found
                </h2>
                <Link
                    href="/dashboard/my-appointments"
                    className="bg-[#000099] text-white px-5 py-3"
                >
                    Back to Appointments
                </Link>
            </div>
        );
    }

    if (
        appointment.status !== "confirmed" ||
        appointment.paymentStatus !== "unpaid"
    ) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
                <h2 className="text-xl font-semibold">
                    Payment Unavailable
                </h2>
                <p className="text-gray-500 text-center">
                    This appointment is not available for payment.
                </p>
                <Link
                    href="/dashboard/my-appointments"
                    className="bg-[#000099] text-white px-5 py-3"
                >
                    Back to Appointments
                </Link>
            </div>
        );
    }

    const formattedPrice = appointment.servicePrice.toLocaleString("en-BD");

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12 md:py-16">
            <div className="mx-auto max-w-6xl">

                {/* Back Navigation */}
                <Link
                    href="/dashboard/my-appointments"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#000099]"
                >
                    <ArrowLeft size={18} />
                    Back to Appointments
                </Link>

                {/* Page Heading */}
                <div className="mb-10">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#000099]">
                        SalonBook Payment
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Complete Your Checkout
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-500">
                        Review your appointment information and confirm
                        the amount before proceeding with your payment.
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

                    {/* Left Column - Appointment Details */}
                    <div className="lg:col-span-3">
                        <div className="h-full border border-gray-200 bg-white p-6 md:p-8">

                            <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-6">
                                <div className="flex h-12 w-12 items-center justify-center bg-blue-50 text-[#000099]">
                                    <CalendarDays size={24} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Appointment Details
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Your booking information
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-7">

                                {/* Customer */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-gray-50 text-[#000099]">
                                        <UserRound size={21} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Customer Name
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {appointment.customer.name}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {appointment.customer.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Appointment Date */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-gray-50 text-[#000099]">
                                        <CalendarDays size={21} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Appointment Date
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {new Date(
                                                `${appointment.appointmentDate}T00:00:00`
                                            ).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Time Slot */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-gray-50 text-[#000099]">
                                        <Clock size={21} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Appointment Time
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {appointment.timeSlot}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Appointment Status */}
                            <div className="mt-10 border-t border-gray-100 pt-6">
                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                                    Appointment Status
                                </p>

                                <span className="inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold capitalize text-emerald-700">
                                    <span className="h-2 w-2 bg-emerald-500" />
                                    {appointment.status}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Right Column - Payment Summary */}
                    <div className="lg:col-span-2">
                        <div className="border border-gray-200 bg-white p-6 md:p-8">

                            <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-6">
                                <div className="flex h-12 w-12 items-center justify-center bg-blue-50 text-[#000099]">
                                    <Receipt size={24} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Payment Summary
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Review your payment
                                    </p>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-gray-500">
                                        Service Price
                                    </span>

                                    <span className="font-semibold text-gray-900">
                                        ৳{formattedPrice}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-gray-500">
                                        Quantity
                                    </span>

                                    <span className="font-semibold text-gray-900">
                                        1
                                    </span>
                                </div>

                                <div className="border-t border-dashed border-gray-200 pt-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-bold text-gray-900">
                                            Total Payable
                                        </span>

                                        <span className="text-2xl font-bold text-[#000099]">
                                            ৳{formattedPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <div className="mt-8">
                                <PayNowButton
                                    appointmentId={appointment._id}
                                    amount={appointment.servicePrice}
                                />
                            </div>

                            {/* Security Information */}
                            <div className="mt-6 flex items-start gap-3 border border-gray-100 bg-gray-50 p-4">
                                <ShieldCheck
                                    size={21}
                                    className="shrink-0 text-emerald-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Secure Payment
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Your payment is securely processed
                                        through Stripe. Your card details
                                        are not stored by SalonBook.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <CreditCard size={15} />
                                Powered by Stripe
                            </div>

                        </div>
                    </div>

                </div>

                {/* Footer Note */}
                <p className="mt-8 text-center text-xs text-gray-400">
                    By proceeding, you agree to complete the payment
                    for your confirmed appointment.
                </p>

            </div>
        </main>
    );
};

export default CheckoutPage;
