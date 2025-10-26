"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Sidebar from "../components/Sidebar";
import { authFetch } from "../utils/authFetch";

export default function Dashboard() {
  const [cars, setCars] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceledBookingsCount, setCanceledBookings] = useState(0);
  const [userid, setUserId] = useState<string | any>("");
  const [role, setRole] = useState<string | any>("");
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setRole(localStorage.getItem("role"));
    const fetchData = async () => {
      try {
        const [carsRes, bookingsRes] = await Promise.all([
          fetch(`${process.env.NEXT_BACKEND_API_URL}/vehicles`, {
            method: "GET",
          }),
          authFetch(`${process.env.NEXT_BACKEND_API_URL}//bookings`, {
            method: "GET",
          }),
        ]);

        const carsData = await carsRes.json();
        const bookingsData = await bookingsRes.json();
        const bookingsDataArr = Object.values(bookingsData.data);
        const filteredBookings = bookingsDataArr.filter(
          (booking: any) => booking.isCanceled == false
        );
        setCanceledBookings(bookingsDataArr.length - filteredBookings.length);

        await setCars(Object.values(carsData.data));

        setBookings(filteredBookings);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const totalCars = cars.filter((car) => car.added_by == userid).length;
  const totalBookings = bookings.length;
  const completedBookings = bookings.length;

  const revenue = bookings.reduce((sum, b) => sum + (b.total || 0), 0);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.from).getTime() - new Date(a.from).getTime())
    .slice(0, 5);

  return (
    <div>
      <Header />
      <main id="section-main" className="flex bg-white">
        <Sidebar />
        <div className="flex-1 bg-white p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <header>
              <h1 className="font-outfit text-3xl font-normal text-slate-900 tracking-tight">
                {(role as string).charAt(0).toUpperCase() +
                  (role as string).slice(1)}{" "}
                Dashboard
              </h1>
              <p className="mt-1 font-outfit text-sm text-slate-500">
                Monitor overall platform performance including total cars,
                bookings, revenue, and recent activities
              </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 my-8">
              {[
                {
                  label: "Total Cars",
                  value: totalCars,
                  icon: "/images/1_894.svg",
                },
                {
                  label: "Total Bookings",
                  value: totalBookings,
                  icon: "/images/1_901.svg",
                },
                {
                  label: "Canceled Bookings",
                  value: canceledBookingsCount,
                  icon: "/images/1_910.svg",
                },
                {
                  label: "Completed Bookings",
                  value: completedBookings,
                  icon: "/images/1_916.svg",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <p className="font-outfit text-sm text-gray-500">
                      {stat.label}
                    </p>
                    <p className="font-outfit text-3xl font-medium text-black mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-2">
                    <img src={stat.icon} className="h-6 w-6" alt={stat.label} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                <h3 className="text-base font-medium text-slate-900 tracking-tight">
                  Recent Bookings
                </h3>
                <p className="text-sm text-slate-500">
                  Latest customer bookings
                </p>
                <div className="mt-6 space-y-5">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <img
                          src="/images/1_931.svg"
                          className="w-4 h-4"
                          alt=""
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-normal text-slate-900">
                          {cars.filter((car) => car.id == booking.vehicleId)[0]
                            .model || "Car"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(booking.from).toLocaleDateString() +
                            " - " +
                            new Date(booking.to).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm text-slate-500">
                        ${booking.total}
                      </div>
                      <div className="border border-slate-200 rounded-full px-3 py-1">
                        <p className="text-xs font-medium text-slate-900">
                          Completed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                <h3 className="text-base font-medium text-slate-900 tracking-tight">
                  Monthly Revenue
                </h3>
                <p className="text-sm text-slate-500">
                  Revenue for current month
                </p>
                <p className="text-4xl font-bold text-blue-600 mt-12">
                  ${revenue}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
