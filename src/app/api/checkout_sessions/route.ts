
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    console.log("========== CHECKOUT STARTED ==========");

    try {
        const { appointmentId } = await req.json();

        console.log("1. Appointment ID:", appointmentId);

        if (!appointmentId) {
            return NextResponse.json(
                { success: false, message: "Appointment ID is required." },
                { status: 400 }
            );
        }

        const token = req.headers.get("authorization");

        console.log("2. Authorization token exists:", !!token);

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access." },
                { status: 401 }
            );
        }

        console.log("3. Fetching appointment from Express...");

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/my-appointments/${appointmentId}`,
            {
                method: "GET",
                headers: {
                    Authorization: token,
                },
                cache: "no-store",
            }
        );

        console.log("4. Appointment API status:", response.status);

        const result = await response.json();

        console.log("5. Appointment API response:", result);

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.message || "Failed to fetch appointment.",
                },
                { status: response.status }
            );
        }

        const appointment = result.appointment ?? result.data ?? result;

        if (!appointment) {
            throw new Error("Appointment not found.");
        }

        console.log("6. Appointment status:", appointment.status);
        console.log("7. Payment status:", appointment.paymentStatus);
        console.log("8. Service price:", appointment.servicePrice);
        console.log("9. Customer ID:", appointment.customerId);

        if (appointment.status !== "confirmed") {
            throw new Error("Only confirmed appointments can be paid.");
        }

        if (appointment.paymentStatus !== "unpaid") {
            throw new Error("This appointment has already been paid.");
        }

        const servicePrice = Number(appointment.servicePrice);

        if (!Number.isFinite(servicePrice) || servicePrice <= 0) {
            throw new Error("Invalid appointment price.");
        }

        console.log("10. Creating Stripe Checkout Session...");

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: "Salon Appointment",
                        },
                        unit_amount: Math.round(servicePrice * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            client_reference_id: String(appointment._id),
            metadata: {
                appointmentId: String(appointment._id),
                customerId: String(appointment.customerId),
            },
            success_url: `${process.env.BETTER_AUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BETTER_AUTH_URL}/payment/cancel`,
        });

        console.log("11. Stripe Session ID:", session.id);
        console.log("12. Stripe Session URL exists:", !!session.url);

        if (!session.url) {
            throw new Error("Stripe Checkout URL was not generated.");
        }

        console.log("========== CHECKOUT SUCCESS ==========");

        return NextResponse.json({
            success: true,
            url: session.url,
        });

    } catch (error) {
        console.error("========== CHECKOUT FAILED ==========");
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Payment checkout failed.",
            },
            { status: 500 }
        );
    }
}
