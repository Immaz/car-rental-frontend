"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { DayPicker } from "react-day-picker";
import { differenceInDays, format } from "date-fns";
import "react-day-picker/dist/style.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { authFetch } from "@/app/utils/authFetch";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function CarView() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [vehicle, setVehicle] = useState<any>({
    pictures: [],
  });
  const [userId, setUserId] = useState<any>();
  const [name, setName] = useState<any>();
  const [role, setRole] = useState<any>();
  const [bookedDays, setBookedDays] = useState<any>();
  const [avgRating, setAvgRatings] = useState<any>(0.0);
  const [totalReviews, setTotalreviews] = useState<any>();

  async function fetchVehicle() {
    try {
      const res = await fetch(
        `${process.env.NEXT_BACKEND_API_URL}/vehicles/${id}`
      );
      const body = await res.json();
      setVehicle(body.data);
    } catch (err) {
      console.error("Error fetching vehicle:", err);
    }
  }
  async function fetchReviews() {
    try {
      const res = await fetch(
        `${process.env.NEXT_BACKEND_API_URL}/vehicles/reviews/${id}`
      );
      const body = await res.json();
      const reviews = Object.values(body.data);
      let totalRatings: number = 0;

      setReviews(reviews);
      setTotalreviews(reviews.length);

      reviews.forEach((review: any) => {
        totalRatings += review.rating as number;
      });
      if (reviews.length > 0) {
        setAvgRatings(((totalRatings / reviews.length) as number).toFixed(2));
      }
    } catch (err) {
      console.error("Error fetching Reviews:", err);
    }
  }

  async function fetchBooking() {
    try {
      const res = await fetch(
        `${process.env.NEXT_BACKEND_API_URL}/bookings/vehicle/${id}`
      );
      const body = await res.json();
      const bookings = body.data;
      const bookedDays: any[] = [];

      bookings.forEach((booking: any) => {
        const start = new Date(booking.from);
        const end = new Date(booking.to);
        let current = new Date(start);
        while (current <= end) {
          bookedDays.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        setBookedDays(bookedDays);
      });
    } catch (err) {
      console.error("Error fetching vehicle:", err);
    }
  }
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setRole(localStorage.getItem("role"));
    setName(localStorage.getItem("name"));
    fetchVehicle();
    fetchBooking();
    fetchReviews();
  }, []);

  // Ratings state
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState<any>([]);

  // Calendar state
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });

  const handleBooking = async () => {
    if (!range?.from || !range?.to) {
      alert("Please select a date range.");
      return;
    }
    const days = differenceInDays(range.to, range.from);
    const total = (days || 1) * Number(vehicle.price);

    router.push(
      `/payment?vehicleId=${id}&from=${range.from.toISOString()}&to=${range.to.toISOString()}&total=${total}&booked_by=${userId}&name=${name}`
    );
  };

  const handleSubmitReview = async (e: any) => {
    e.preventDefault();
    const newReview = { name, rating, text: review, vehicle_id: id };
    try {
      const res = await authFetch(
        `${process.env.NEXT_BACKEND_API_URL}/vehicles/review/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReview),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await res.json();
    } catch (err) {
      console.error("Error submitting review:", err);
    }
    authFetch;
    setReviews([newReview, ...reviews]);
    setRating(0);
    setHover(0);
    setReview("");
  };

  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <>
      <Header />
      {/* Hero Section */}
      <section id="section-hero" className="bg-white pt-8 md:pt-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <a
              onClick={() => router.push("/search")}
              className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-outfit"
            >
              <img
                src="/images/1_286.svg"
                alt="Back arrow"
                className="h-4 w-4"
              />
              Back to all cars
            </a>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Carousel */}
            <div className="flex-2 w-full lg:w-2/3">
              <Slider {...sliderSettings}>
                {vehicle.pictures.map((pic: any) => (
                  <div key={pic.id}>
                    <img
                      src={pic.url}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-[400px] object-cover rounded-xl"
                    />
                  </div>
                ))}
              </Slider>

              <div className="mt-6">
                <h1 className="text-3xl font-semibold text-slate-800 font-outfit">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-base text-gray-500 mt-1 font-outfit">
                  {vehicle.year} • {vehicle.category}
                </p>
              </div>
            </div>

            {/* Booking Form with Calendar */}
            <div className="lg:col-span-1 mt-8 lg:mt-0 flex-1 lg:ml-5">
              <div className="bg-white rounded-xl shadow-lg p-6 top-6">
                <div className="flex justify-between items-baseline mb-5">
                  <p className="text-2xl font-semibold text-slate-800 font-outfit">
                    ${vehicle.price}
                  </p>
                  <p className="text-sm text-gray-500 font-outfit">per day</p>
                </div>
                <hr className="border-gray-200" />

                {/* Calendar */}
                <div className="mt-5">
                  <DayPicker
                    mode="range"
                    selected={range as any}
                    onSelect={setRange as any}
                    disabled={bookedDays}
                    modifiersClassNames={{
                      disabled:
                        "bg-gray-200 text-gray-400 line-through cursor-not-allowed",
                    }}
                  />
                  <div className="mt-3 text-sm text-gray-600">
                    {range?.from && range?.to ? (
                      <p>
                        Selected:{" "}
                        <strong>
                          {format(range.from, "MMM dd, yyyy")} –{" "}
                          {format(range.to, "MMM dd, yyyy")}
                        </strong>
                      </p>
                    ) : (
                      <p>Select your booking dates</p>
                    )}
                  </div>
                </div>

                {(role === "customer" || role === "admin") && (
                  <>
                    <button
                      onClick={handleBooking}
                      type="submit"
                      className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
                    >
                      Book Now
                    </button>

                    <p
                      style={{ marginTop: 10 }}
                      className="text-xs text-gray-500 text-center mt-1 font-outfit"
                    >
                      Credit card required to reserve
                    </p>
                  </>
                )}
              </div>

              {/* Ratings */}
              <div className="flex items-center mt-4 mx-auto justify-center">
                <svg
                  className="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
                <p className="ms-2 text-sm font-bold text-gray-900">
                  {avgRating}
                </p>
                <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full"></span>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-900 underline hover:no-underline"
                >
                  {totalReviews + " Reviews"}
                </a>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Vehicle Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <img
                src="/images/1_304.svg"
                alt="Seats Icon"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium text-gray-900 font-roboto">
                {vehicle.capacity} Seats
              </span>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <img
                src="/images/1_311.svg"
                alt="Fuel Icon"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium text-gray-900 font-roboto">
                {vehicle.fuel}
              </span>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <img
                src="/images/1_318.svg"
                alt="Transmission Icon"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium text-gray-900 font-roboto">
                {vehicle.transmission}
              </span>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
              <img
                src="/images/1_325.svg"
                alt="Location Icon"
                className="h-5 w-5"
              />
              <span className="text-sm font-medium text-gray-900 font-roboto">
                {vehicle.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features + Reviews */}
      <section
        id="section-features"
        className="bg-white pt-8 pb-12 md:pt-12 md:pb-24"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
            {/* Description & Features */}
            <div className="lg:col-span-2">
              <div>
                <h2 className="text-xl font-medium text-gray-900 font-roboto">
                  Description
                </h2>
                <p className="mt-3 text-base text-slate-500 font-roboto leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            </div>

            {/* Ratings & Reviews */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-xl font-medium text-gray-900 font-roboto mb-4">
                Ratings & Reviews
              </h2>
              {/* Rating Form */}
              {role && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-gray-50 p-4 rounded-lg shadow-md space-y-3"
                >
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => {
                      const starValue = i + 1;
                      return (
                        <svg
                          key={i}
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHover(starValue)}
                          onMouseLeave={() => setHover(0)}
                          className={`w-6 h-6 cursor-pointer ${
                            starValue <= (hover || rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.287-3.966z" />
                        </svg>
                      );
                    })}
                  </div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your feedback..."
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="mt-6 space-y-4">
                {reviews.map((rev: any, idx: any) => (
                  <div key={idx} className="border-b pb-3">
                    <p className="text-sm font-medium text-gray-900">
                      {rev.name}
                    </p>
                    <p className="text-yellow-400 text-sm">
                      {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
