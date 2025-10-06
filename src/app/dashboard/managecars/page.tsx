"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { authFetch } from "@/app/utils/authFetch";

export default function ManageCars() {
  const [cars, setCars] = useState<any[]>([]);
  const router = useRouter();

  // Fetch vehicles
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    authFetch("http://localhost:4000/vehicles")
      .then((res) => res.json())
      .then((body) => {
        let cars = body.data;
        let mycars = cars.filter((car: any) => car.added_by == userId);
        setCars(mycars);
      })
      .catch((err) => console.error("Error fetching vehicles:", err));
  }, []);

  // Delete vehicle
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const res = await authFetch(`http://localhost:4000/vehicles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCars(cars.filter((car) => car.id !== id));
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
    }
  };

  return (
    <div>
      <Header />
      <section id="section-dashboard" className="bg-white">
        <div>
          <div className="flex flex-col md:flex-row">
            <Sidebar />
            <main className="flex-1 py-8 md:border-l md:pl-8 border-gray-200">
              <div className="mb-8">
                <h1 className="text-3xl font-outfit text-gray-900 tracking-tight">
                  Manage Cars
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  View all listed cars, update their details, or remove them
                  from the booking platform
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="flex bg-gray-50 px-4 py-3 text-left text-sm font-medium text-slate-500">
                      <div className="w-2/5">Car</div>
                      <div className="w-1/5">Category</div>
                      <div className="w-1/5">Price</div>
                      <div className="w-1/5">Status</div>
                      <div className="w-auto flex-shrink-0 text-center">
                        Actions
                      </div>
                    </div>

                    <div className="bg-white">
                      {cars.map((car) => (
                        <div
                          key={car.id}
                          className="flex items-center border-b border-gray-200 px-4 py-4"
                        >
                          <div className="w-2/5 flex items-center gap-3">
                            <img
                              className="h-12 w-12 rounded-md object-cover"
                              src={
                                car.pictures?.[0]?.url ||
                                "/images/placeholder.png"
                              }
                              alt={`${car.brand} ${car.model}`}
                            />
                            <div>
                              <p className="font-medium text-gray-800 text-sm">
                                {car.brand} {car.model}
                              </p>
                              <p className="text-xs text-slate-500">
                                {car.capacity} seats • {car.transmission}
                              </p>
                            </div>
                          </div>

                          <div className="w-1/5 text-sm text-gray-800">
                            {car.category}
                          </div>

                          <div className="w-1/5 text-sm text-gray-800">
                            ${car.price}/day
                          </div>

                          <div className="w-1/5">
                            <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-2.5 py-0.5 text-status-green">
                              <p className="whitespace-nowrap text-xs">
                                Available
                              </p>
                            </span>
                          </div>

                          <div className="w-auto flex-shrink-0 flex items-center justify-center gap-2">
                            <button
                              onClick={() => router.push(`/car/${car.id}`)}
                              className="p-2 hover:bg-gray-100 rounded-md"
                            >
                              <img
                                src="/images/1_1280.svg"
                                alt="Update"
                                className="h-4 w-4"
                              />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/dashboard/updatecar/${car.id}`)
                              }
                              className="p-2 hover:bg-gray-100 rounded-md"
                            >
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="h-4 w-4 text-gray-600"
                              />
                            </button>

                            <button
                              onClick={() => handleDelete(car.id)}
                              className="p-2 hover:bg-gray-100 rounded-md"
                            >
                              <img
                                src="/images/1_1284.svg"
                                alt="Delete"
                                className="h-4 w-4"
                              />
                            </button>
                          </div>
                        </div>
                      ))}

                      {cars.length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-500">
                          No cars found.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
