
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    try {
        const { appointmentId } = await req.json();

        if (!appointmentId) {
            return NextResponse.json(
                { success: false, message: "Appointment ID is required." },
                { status: 400 }
            );
        }

        // Get authentication token
        const token = req.headers.get("authorization");

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access." },
                { status: 401 }
            );
        }

        // Fetch appointment from Express backend
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

        const result = await response.json();

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
            return NextResponse.json(
                { success: false, message: "Appointment not found." },
                { status: 404 }
            );
        }

        // Validate appointment
        if (appointment.status !== "confirmed") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only confirmed appointments can be paid.",
                },
                { status: 400 }
            );
        }

        if (appointment.paymentStatus !== "unpaid") {
            return NextResponse.json(
                {
                    success: false,
                    message: "This appointment has already been paid.",
                },
                { status: 400 }
            );
        }

        // Validate price
        const servicePrice = Number(appointment.servicePrice);

        if (!Number.isFinite(servicePrice) || servicePrice <= 0) {
            return NextResponse.json(
                { success: false, message: "Invalid appointment price." },
                { status: 400 }
            );
        }

        // Create Stripe Checkout Session
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

        if (!session.url) {
            throw new Error("Stripe Checkout URL was not generated.");
        }

        return NextResponse.json({
            success: true,
            url: session.url,
        });

    } catch (error) {
        console.error("Stripe Checkout Error:", error);

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
