"use client";
import Link from "next/link";
import React, { useState } from "react";
import { redirect, useParams } from "next/navigation";
import { authFetch } from "@/app/utils/authFetch";
const ForgotPasswordUser = () => {
  const [passmatch, setPassmatch] = useState(true);
  const [pass, setPass] = useState("");
  const [confirmpass, setConfirmpass] = useState("");

  const params = useParams();
  const userId = params.id;

  const updatePassword = async (e: any) => {
    e.preventDefault();
    console.log("passmatch", passmatch);
    if (pass === confirmpass) {
      setPassmatch(true);
      const formData = new FormData(e.currentTarget);
      const updateStatus = await authFetch(
        `${process.env.NEXT_BACKEND_API_URL}/users/`,
        {
          method: "PATCH",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((body) => (body.status === "success" ? true : false));

      if (updateStatus) {
        redirect("/login");
      }
    } else {
      setPassmatch(false);
      return;
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Forgot Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={updatePassword}
            action="#"
            method="POST"
            className="space-y-6"
          >
            <input type="hidden" name="userId" value={userId} />
            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmpassword"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmpassword"
                  type="password"
                  name="password"
                  value={confirmpass}
                  onChange={(e) => setConfirmpass(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Update
              </button>
            </div>
            {!passmatch && (
              <p className="text-center text-sm text-red-500">
                Password Doesn't Match
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordUser;
