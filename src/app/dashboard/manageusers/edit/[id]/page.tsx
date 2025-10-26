"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { authFetch } from "@/app/utils/authFetch";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  dob: string;
  address: string;
  role: string;
}

export default function EditUser() {
  let [user, setUser] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    dob: "",
    address: "",
    role: "",
  });
  let [roles, setRoles] = useState(["admin", "owner", "customer"]);
  let [role, setRole] = useState("");

  const params = useParams();
  const userId = params.id;

  function handleChange(e: any) {
    const { name, value } = e.target;

    setUser((prev: any) => {
      const obj = {
        ...prev,
        [name]: value,
      };
      return obj;
    });
  }
  function submit(e: any) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/${userId}/edit`,
      {
        method: "PATCH",
        body: formdata,
      }
    ).then((response) => {
      redirect("/dashboard/manageusers");
    });
  }

  async function getUserById(userId: any) {
    const user = await authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/${userId}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((body) => {
        setUser(body.data.user);
        setRole(body.data.user.role);
      });
  }
  useEffect(() => {
    getUserById(userId);
  }, []);
  return (
    <div>
      <Header />
      <section id="section-main" className="flex bg-white">
        <Sidebar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">
              Users
            </h1>
            <p className="mt-2 text-lg text-slate-500">Edit and Delete users</p>
          </div>

          {/* Bookings List */}
          <div className="space-y-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form
                onSubmit={(e) => submit(e)}
                action="/register"
                method="POST"
                className="space-y-6"
              >
                <div className="flex mt-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      First Name
                    </label>
                    <div>
                      <input
                        id="name"
                        type="name"
                        name="first_name"
                        value={user?.first_name}
                        required
                        onChange={(e) => handleChange(e)}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div className="ml-2">
                    <label
                      htmlFor="name"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Last Name
                    </label>
                    <div>
                      <input
                        id="name"
                        type="name"
                        name="last_name"
                        value={user?.last_name}
                        required
                        onChange={(e) => handleChange(e)}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={user?.email}
                      onChange={(e) => handleChange(e)}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Role
                  </label>
                  <div className="mt-2">
                    <select
                      id="role"
                      name="role"
                      value={user?.role}
                      onChange={(e) => handleChange(e)}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="phone_no"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Phone Number
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      type="tel"
                      id="phone_no"
                      name="phone_no"
                      value={user?.phone_no}
                      onChange={(e) => handleChange(e)}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="dob"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Date of Birth
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      onChange={(e) => handleChange(e)}
                      value={user?.dob}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="address"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Address
                    </label>
                  </div>
                  <div className="mt-2">
                    <textarea
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      name="address"
                      value={user?.address}
                      onChange={(e) => handleChange(e)}
                      id="address"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
