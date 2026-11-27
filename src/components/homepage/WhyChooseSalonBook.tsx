
import React from "react";
import Image from "next/image";
import {
    CalendarCheck,
    Sparkles,
    Clock,
    ShieldCheck,
} from "lucide-react";
import why from "@/../public/images/why_choose_us.png";

const features = [
    {
        icon: CalendarCheck,
        title: "Easy Online Booking",
        description:
            "Book your favorite salon services anytime, anywhere.",
    },
    {
        icon: Sparkles,
        title: "Quality Salon Services",
        description:
            "Explore a variety of beauty and personal care services.",
    },
    {
        icon: Clock,
        title: "Flexible Scheduling",
        description:
            "Choose a convenient date and available time slot.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Online Payment",
        description:
            "Enjoy secure and convenient payments through Stripe.",
    },
];

const WhyChooseSalonBook = () => {
    return (
        <section className="bg-[#F7F8FC] px-4 py-16 md:px-8 md:py-20 lg:px-16">

            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-12 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0B1F54]">
                        The SalonBook Advantage
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                        Why Choose SalonBook?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
                        Your beauty, your schedule, your experience.
                        We make salon appointment booking simple and convenient.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">

                    {/* Left Side - Feature Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="group border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0B1F54] hover:shadow-lg hover:shadow-[#0B1F54]/10"
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center bg-[#0B1F54]/5 text-[#0B1F54] transition duration-300 group-hover:bg-[#0B1F54] group-hover:text-white">
                                        <Icon size={24} strokeWidth={1.8} />
                                    </div>

                                    <p className="mb-2 text-xs font-bold tracking-widest text-[#0B1F54]/50">
                                        0{index + 1}
                                    </p>

                                    <h3 className="text-lg font-bold text-gray-900">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-gray-500">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}

                    </div>

                    {/* Right Side - Salon Image */}
                    <div className="relative min-h-[400px] overflow-hidden bg-gray-200 lg:min-h-full">

                        <Image
                            src={why}
                            alt="Professional salon hair styling experience"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition duration-700 hover:scale-105"
                        />

                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071633]/80 via-transparent to-transparent" />

                        {/* Image Text */}
                        <div className="absolute bottom-0 left-0 p-7 md:p-10">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                                Beauty Meets Excellence
                            </p>

                            <h3 className="max-w-md text-3xl font-bold leading-tight text-white md:text-4xl">
                                Feel Beautiful.
                                <br />
                                Feel Confident.
                            </h3>

                            <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
                                Experience the beauty and care you deserve
                                with SalonBook.
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default WhyChooseSalonBook;