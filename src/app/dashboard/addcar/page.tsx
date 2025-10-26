"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import Swal from "sweetalert2";
import { authFetch } from "@/app/utils/authFetch";
import { redirect } from "next/navigation";
export default function AddCar() {
  const [addedby, setAddedby] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setAddedby(userId);
  }, []);

  // Handle file selection
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  }

  async function PostCar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      Swal.fire({
        title: "Uploading...",
        text: "Please wait while we add your car.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vehicles`,
        {
          method: "POST",
          body: formData,
        }
      );

      const body = await res.json();

      if (body.data.status === "success") {
        setSelectedImages([]);

        Swal.fire({
          icon: "success",
          title: "Car Added!",
          text: "Your car has been listed successfully.",
          confirmButtonColor: "#2563eb",
        });
        redirect("/dashboard/managecars");
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Something went wrong while adding the car.",
        });
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Could not connect to server.",
      });
    }
  }

  return (
    <div>
      <Header />

      <div id="section-main" className="flex bg-white">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 lg:p-10">
          <div className="max-w-4xl">
            <h1 className="font-outfit text-3xl text-gray-900">Add New Car</h1>
            <p className="mt-2 text-sm font-outfit text-slate-500">
              Fill in details to list a new car for booking, including pricing,
              availability, and car specifications.
            </p>

            <form className="mt-10 space-y-8" onSubmit={PostCar}>
              <input type="hidden" name="added_by" value={addedby ?? ""} />

              {/* Image Upload + Previews */}
              <div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
                    <img
                      src="/images/45_5.svg"
                      alt="Upload Icon"
                      className="h-10"
                    />
                  </div>
                  <input
                    required
                    type="file"
                    name="pictures"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </div>

                {/* Previews */}
                {selectedImages.length > 0 && (
                  <div className="mt-4 flex gap-3 flex-wrap">
                    {selectedImages.map((file, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 border rounded-lg overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand + Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                  >
                    Brand
                  </label>
                  <input
                    required
                    type="text"
                    id="brand"
                    name="brand"
                    placeholder="e.g. BMW, Mercedes, Audi..."
                    className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit placeholder:text-slate-400/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="model"
                    className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                  >
                    Model
                  </label>
                  <input
                    required
                    type="text"
                    id="model"
                    name="model"
                    placeholder="e.g. X5, E-class, M4..."
                    className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit placeholder:text-slate-400/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Year + Price + Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                  >
                    Year
                  </label>
                  <input
                    required
                    type="number"
                    id="year"
                    name="year"
                    placeholder="2025"
                    className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit placeholder:text-slate-400/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                  >
                    Daily Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    id="price"
                    name="price"
                    min={0}
                    placeholder="100"
                    className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit placeholder:text-slate-400/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                  >
                    Category
                  </label>
                  <select
                    defaultValue={""}
                    required
                    id="category"
                    name="category"
                    className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              {/* Transmission + Fuel + Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="transmission"
                    className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                  >
                    Transmission
                  </label>
                  <select
                    defaultValue={""}
                    required
                    id="transmission"
                    name="transmission"
                    className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="" disabled>
                      Select transmission
                    </option>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="fuel"
                    className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                  >
                    Fuel Type
                  </label>
                  <select
                    required
                    id="fuel"
                    name="fuel"
                    defaultValue={""}
                    className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="" disabled>
                      Select fuel type
                    </option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                  >
                    Seating Capacity
                  </label>
                  <input
                    required
                    type="number"
                    id="capacity"
                    name="capacity"
                    placeholder="5"
                    min={2}
                    className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit placeholder:text-slate-400/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                >
                  Location
                </label>
                <input
                  required
                  type="text"
                  id="location"
                  name="location"
                  placeholder="eg. San Francisco, CA"
                  className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit placeholder:text-slate-400/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium font-outfit text-slate-600 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  name="description"
                  placeholder="Describe your car, its condition, and any notable details..."
                  className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm font-outfit placeholder:text-slate-400/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                ></textarea>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-outfit font-medium text-sm px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <img
                    src="/images/1_1159.svg"
                    alt="Checkmark"
                    className="w-4 h-4"
                  />
                  <span>List Your Car</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
