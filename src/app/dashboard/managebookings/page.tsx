"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { authFetch } from "@/app/utils/authFetch";

interface VehiclePicture {
  id: number;
  url: string;
  vehicle_id: number;
  fileId: string;
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: string;
  category: string;
  transmission: string;
  fuel: string;
  capacity: number;
  location: string;
  description: string;
  added_by: number;
  pictures: VehiclePicture[];
}

interface Booking {
  id: number;
  booked_by: number;
  vehicleId: number;
  from: string;
  to: string;
  vehicle: Vehicle;
  isCanceled: boolean;
  total: number;
}

export default function ManageBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await authFetch("http://localhost:4000/bookings");
      const body = await res.json();
      const bookings = Object.values(body.data);
      setBookings(bookings as any);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  async function cancelBooking(id: number) {
    try {
      setLoadingId(id);
      await authFetch(`http://localhost:4000/bookings/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: id }),
      });
      await fetchBookings();
    } catch (error) {
      console.error("Error canceling booking:", error);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div>
      <Header />
      <section id="section-main" className="flex bg-white">
        <Sidebar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">
              My Bookings
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              View and manage your car bookings
            </p>
          </div>

          {/* Bookings List */}
          <div className="space-y-8">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-slate-200 rounded-lg p-6 flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8"
              >
                {/* Vehicle Image & Info */}
                <div className="w-full lg:w-72 flex-shrink-0">
                  <img
                    src={
                      booking.vehicle.pictures[0]?.url ||
                      "/images/placeholder-car.jpg"
                    }
                    alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                    className="w-full h-auto object-cover rounded-md aspect-video"
                  />
                  <h3 className="mt-4 text-base font-semibold text-slate-800">
                    {booking.vehicle.brand} {booking.vehicle.model}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {booking.vehicle.year} • {booking.vehicle.category} •{" "}
                    {booking.vehicle.location}
                  </p>
                </div>

                {/* Booking Details */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-slate-800 text-xs font-normal px-2.5 py-1 rounded">
                      Booking #{booking.id}
                    </span>
                    {booking.isCanceled ? (
                      <span className="bg-red-100 text-red-600 text-xs font-medium px-3 py-0.5 rounded-full font-inter">
                        Cancelled
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 text-xs font-medium px-3 py-0.5 rounded-full font-inter">
                        Confirmed
                      </span>
                    )}
                  </div>

                  <div className="mt-6 space-y-5">
                    <div className="flex items-start gap-3">
                      <img
                        src="/images/1_742.svg"
                        alt="Calendar"
                        className="h-5 w-5 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm text-slate-500">Rental Period</p>
                        <p className="text-sm font-medium text-slate-800">
                          {new Date(booking.from).toLocaleDateString()} -{" "}
                          {new Date(booking.to).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <img
                        src="/images/1_746.svg"
                        alt="Location"
                        className="h-5 w-5 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm text-slate-500">
                          Pick-up Location
                        </p>
                        <p className="text-sm font-medium text-slate-800">
                          {booking.vehicle.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="w-full lg:w-48 flex-shrink-0 lg:text-right border-t pt-4 lg:border-none lg:pt-0 space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Booking Total</p>
                    <p className="text-2xl font-semibold text-blue-600">
                      ${booking.total}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Booked on {new Date(booking.from).toLocaleDateString()}
                    </p>
                  </div>
                  {!booking.isCanceled && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      disabled={loadingId === booking.id}
                      className="w-full lg:w-auto bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm disabled:opacity-50"
                    >
                      {loadingId === booking.id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <p className="text-slate-500 text-center">No bookings found.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
