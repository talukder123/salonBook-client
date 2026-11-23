
import CheckoutPage from "@/components/payment/CheckoutPage";
import { Suspense } from "react";

const Page = () => {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                    Loading checkout...
                </div>
            }
        >
            <CheckoutPage />
        </Suspense>
    );
};

export default Page;
