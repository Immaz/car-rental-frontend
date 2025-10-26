/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  transmission: string;
  fuel: string;
  type: string;
  capacity: number;
  location: string;
  seats: number;
  description: string;
  added_by: number;
  pictures: Array<{ url: string }>;
}
export default function SearchBody() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    returnDate: searchParams.get("returnDate") || "",
    vehicleType: searchParams.get("type") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_BACKEND_API_URL}/vehicles/search`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ query, ...filters }),
          }
        );
        const body = await res.json();
        setVehicles(body.data || []);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [filters, query]);

  async function SearchWithFilters() {
    const data = {
      query,
      ...filters,
    };

    await fetch(`${process.env.NEXT_BACKEND_API_URL}/vehicles/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    })
      .then((resp) => resp.json())
      .then((body) => setVehicles(body.data));
  }
  return (
    <div>
      <Header />

      <section id="section-hero" className="bg-slate-100 pt-16 pb-12 relative">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tighter">
            Available Cars
          </h1>
          <p className="mt-4 text-lg text-slate-500 flex justify-center">
            Browse our selection of premium vehicles available for your next
            adventure
          </p>

          <div className="mt-8 max-w-3xl mx-auto relative flex items-center">
            <img
              src="/images/1_470.svg"
              alt="Search"
              className="absolute left-5 h-5 w-5 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search by brand model year eg. ford mustang 2018"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  SearchWithFilters();
                }
              }}
              className="w-full bg-white border border-slate-200 rounded-full py-4 pl-14 pr-14 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              className="absolute right-5 p-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <img
                src="/images/1_474.svg"
                alt="Filter"
                className="h-5 w-5 text-slate-500"
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg text-left">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Enter location"
                />
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={filters.pickupDate}
                    onChange={(e) =>
                      setFilters({ ...filters, pickupDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={filters.returnDate}
                    onChange={(e) =>
                      setFilters({ ...filters, returnDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={filters.vehicleType}
                  onChange={(e) =>
                    setFilters({ ...filters, vehicleType: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option value="">Any</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                  placeholder="Min $"
                  className="border border-gray-300 rounded-md p-2 text-sm"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                  placeholder="Max $"
                  className="border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              <button
                onClick={SearchWithFilters}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="section-cars" className="bg-slate-100 pb-16 md:pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-base text-gray-500 mb-8">
            {loading ? "Loading cars..." : `Showing ${vehicles.length} Cars`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {!loading &&
              vehicles.map((car: Vehicle) => (
                <div
                  onClick={() => router.push(`/car/${car.id}`)}
                  key={car.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={car.pictures[0].url || "/images/placeholder-car.jpg"}
                      alt={car.model}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-normal px-3 py-1 rounded-full">
                      Available Now
                    </span>
                    <span className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-normal px-2 py-1 rounded-md">
                      ${car.price}/day
                    </span>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-medium text-black text-lg">
                      {car.brand + " " + car.model}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {car.type} {car.year}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <img
                          src="/images/3311_377.svg"
                          alt="seats icon"
                          className="h-4 w-4 mr-1"
                        />
                        <span>{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center">
                        <img
                          src="/images/3311_381.svg"
                          alt="fuel icon"
                          className="h-4 w-4 mr-1"
                        />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center">
                        <img
                          src="/images/3311_378.svg"
                          alt="transmission icon"
                          className="h-4 w-4 mr-1"
                        />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center">
                        <img
                          src="/images/3311_383.svg"
                          alt="location icon"
                          className="h-4 w-4 mr-1"
                        />
                        <span>{car.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
