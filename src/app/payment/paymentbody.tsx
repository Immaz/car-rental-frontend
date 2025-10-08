"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { authFetch } from "../utils/authFetch";

const stripePromise = loadStripe(
  "pk_test_51SBstRIiWoDcwbmJJApLKbvsnzDOn91TtSrZ0CwJxuavIDfx39Pd5N4C8OG4BduTeSoP8wFUZfta0wthDqJCdJFB00tJ8nRHdF"
);

type BookingData = {
  vehicleId?: string | null;
  from?: string | null;
  to?: string | null;
  total?: number | null;
  booked_by?: string | null;
};

// ---------- Checkout form (uses CardElement) ----------
function CheckoutForm({
  clientSecret,
  paymentIntentId,
  bookingData,
  onSuccessRedirect = () => {},
}: {
  clientSecret: string;
  paymentIntentId: string;
  bookingData: BookingData;
  onSuccessRedirect?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!stripe || !elements) {
      setErrorMsg("Stripe not loaded yet.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setErrorMsg("Card element not found.");
      return;
    }

    setLoading(true);

    try {
      // Confirm the card payment with the client secret (secure)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        setErrorMsg(result.error.message ?? "Payment failed.");
        setLoading(false);
        return;
      }

      const pi = result.paymentIntent;
      if (pi && pi.status === "succeeded") {
        // Payment succeeded -> finalize booking on your backend
        const res = await authFetch("http://localhost:4000/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleId: bookingData.vehicleId,
            from: bookingData.from,
            to: bookingData.to,
            total: bookingData.total,
            booked_by: bookingData.booked_by,
            paymentIntentId, // backend will verify with Stripe
          }),
        });

        if (!res.ok) {
          const body = await res.text();
          setErrorMsg("Booking save failed: " + body);
          setLoading(false);
          return;
        }

        // success -> redirect
        onSuccessRedirect();
      } else {
        setErrorMsg("Payment did not complete.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-2xl shadow-lg space-y-4"
    >
      <h3 className="text-lg font-semibold">Payment Details</h3>

      <div className="text-sm text-gray-600">
        <p className="mb-2">
          Enter your card details below. This is secured by Stripe.
        </p>
      </div>

      <div className="p-3 border rounded-lg">
        <CardElement
          options={{ style: { base: { fontSize: "16px", color: "#111827" } } }}
        />
      </div>

      {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn btn-primary text-white py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
      >
        {loading ? "Processing..." : `Pay $${bookingData.total ?? "0.00"}`}
      </button>
    </form>
  );
}

// ---------- Page ----------
export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();

  // parse booking data from query params
  const bookingData: BookingData = {
    vehicleId: params.get("vehicleId"),
    from: params.get("from"),
    to: params.get("to"),
    total: params.get("total") ? Number(params.get("total")) : null,
    booked_by: params.get("booked_by"),
  };

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [intentError, setIntentError] = useState<string | null>(null);

  useEffect(() => {
    // Guard: total must exist
    if (!bookingData.total || isNaN(bookingData.total)) {
      setIntentError("Invalid booking total.");
      setLoadingIntent(false);
      return;
    }

    // Create PaymentIntent (backend returns clientSecret + paymentIntentId)
    (async () => {
      try {
        setLoadingIntent(true);
        const res = await authFetch("http://localhost:4000/payments/stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ total: bookingData.total }),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to create payment intent");
        }

        const body = await res.json();
        const data = body.data ?? {};
        if (!data.clientSecret || !data.paymentIntentId) {
          throw new Error(
            "Payment endpoint did not return clientSecret/paymentIntentId"
          );
        }

        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (err: any) {
        setIntentError(err?.message ?? "Error creating payment intent");
      } finally {
        setLoadingIntent(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedFrom = bookingData.from
    ? new Date(bookingData.from).toLocaleDateString()
    : "-";
  const formattedTo = bookingData.to
    ? new Date(bookingData.to).toLocaleDateString()
    : "-";
  const formattedTotal =
    bookingData.total != null ? bookingData.total.toFixed(2) : "0.00";

  const handleSuccessRedirect = () => {
    router.push("/dashboard/managebookings");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* LEFT: Booking summary */}
          <aside className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="text-xs text-gray-500">Vehicle</p>
                <p className="font-medium">{bookingData.vehicleId ?? "—"}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">From</p>
                <p>{formattedFrom}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">To</p>
                <p>{formattedTo}</p>
              </div>

              <div className="pt-3 border-t mt-3">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${formattedTotal}
                </p>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>
                  No charges will appear on your bank statement until payment is
                  completed.
                </p>
              </div>
            </div>
          </aside>

          {/* RIGHT: Payment form */}
          <section>
            {loadingIntent ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
                <div className="text-gray-600">
                  Preparing secure payment...{" "}
                </div>
              </div>
            ) : intentError ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-red-600">Error: {intentError}</p>
              </div>
            ) : clientSecret && paymentIntentId ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: "stripe" as const },
                }}
              >
                <CheckoutForm
                  clientSecret={clientSecret}
                  paymentIntentId={paymentIntentId}
                  bookingData={bookingData}
                  onSuccessRedirect={handleSuccessRedirect}
                />
              </Elements>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-600">Unable to initialize payment.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
