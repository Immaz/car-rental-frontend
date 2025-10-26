"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { authFetch } from "@/app/utils/authFetch";
export default function UpdateCar() {
  const { id } = useParams();
  const router = useRouter();

  const [car, setCar] = useState<any>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Fetch vehicle by id
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_BACKEND_API_URL}/vehicles/${id}`)
        .then((res) => res.json())
        .then((body) => {
          if (body.status === "success") {
            setCar(body.data);
            if (body.data.pictures && Array.isArray(body.data.pictures)) {
              setPreviewUrls(body.data.pictures.map((p: any) => p.url));
            }
          }
        })
        .catch((err) => console.error("Error fetching car:", err));
    }
  }, [id]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Uploading...",
        text: "Please wait while we add your car.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const form = new FormData(e.currentTarget as any);
      const res = await authFetch(
        `${process.env.NEXT_BACKEND_API_URL}/vehicles/${id}`,
        {
          method: "PATCH",
          body: form,
        }
      );

      const response = await res.json();

      if (res.ok) {
        Swal.close();
        router.push(`/car/${id}`);
      } else {
        alert("Failed to update car");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong while adding the car.",
      });
    }
  };

  if (!car) {
    return <p className="p-6">Loading car details...</p>;
  }

  return (
    <div>
      <Header />
      <div id="section-main" className="flex bg-white">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 lg:p-10">
          <div className="max-w-4xl">
            <h1 className="font-outfit text-3xl text-gray-900">Update Car</h1>
            <p className="mt-2 text-sm font-outfit text-slate-500">
              Update details of your car listing below.
            </p>

            <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Car Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  name="pictures"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0 file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="flex flex-wrap gap-3 mt-4">
                  {previewUrls.length > 0 ? (
                    previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="w-24 h-24 border rounded-md overflow-hidden"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No images uploaded</p>
                  )}
                </div>
              </div>

              {/* Brand & Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={car.brand}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={car.model}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Year, Price, Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={car.year}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Daily Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={car.price}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={car.category}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-sm"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              {/* Transmission, Fuel, Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    value={car.transmission}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-sm"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Fuel Type
                  </label>
                  <select
                    name="fuel"
                    value={car.fuel}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-sm"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={car.capacity}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={car.location}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2.5 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={car.description}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2.5 text-sm"
                ></textarea>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium text-sm px-6 py-3 rounded-md hover:bg-blue-700"
                >
                  Update Car
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
