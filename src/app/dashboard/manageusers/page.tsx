"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import { authFetch } from "@/app/utils/authFetch";
import Link from "next/link";

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

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  function deleteUser(user_id: number) {
    authFetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/${user_id}/delete`,
      {
        method: "DELETE",
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        window.location.reload();
      });
  }
  useEffect(() => {
    authFetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}//users`, {
      method: "get",
    })
      .then((resp) => resp.json())
      .then((body) => {
        const users = Object.values(body.data);
        console.log(body);
        setUsers(users as any);
      });
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date to Birth
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: User) => {
                  return (
                    <tr
                      key={user.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {user.first_name + " " + user.last_name}
                      </th>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone_no}</td>
                      <td className="px-6 py-4">{user.dob}</td>
                      <td className="px-6 py-4">{user.address}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td>
                        <Link
                          href={`/dashboard/manageusers/edit/${user.id}`}
                          className=" cursor-pointer inline-flex border font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-amber-500 border-amber-500 text-amber-50 hover:bg-amber-400 hover:border-amber-400"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className=" cursor-pointer ml-2 inline-flex border font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-red-500 border-red-500 text-red-50 hover:bg-red-400 hover:border-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
