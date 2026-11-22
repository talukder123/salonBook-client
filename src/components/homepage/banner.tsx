
import Image from "next/image";
import Link from "next/link";
import bannerIMG from "@/../public/images/banner_img.png";

const Banner = () => {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 pt-6 sm:px-10 lg:px-16 xl:px-20">

      <div className="relative flex min-h-[420px] items-end overflow-hidden bg-gray-900 md:min-h-[520px]">

        {/* Background Image */}
        <Image
          src={bannerIMG}
          alt="SalonBook premium salon experience"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-6 py-10 text-white sm:px-10 md:px-12 md:py-14">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[3px] text-gray-200">
            Welcome to SalonBook
          </p>

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Your Beauty,
            <span className="block text-blue-200">
              Our Passion.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-200 sm:text-base">
            Discover premium salon services and experience
            exceptional beauty care. Book your favorite services
            with ease and let us take care of your beauty.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex h-12 items-center justify-center bg-[#0B1F54] px-7 text-sm font-semibold text-white transition hover:bg-[#142f70]"
          >
            Explore Salon Services
          </Link>

        </div>
      </div>
    </section>
  );
};

export default Banner;
