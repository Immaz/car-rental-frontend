"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { authFetch } from "../utils/authFetch";

const ForgotPassword = () => {
  const [mailsent, setMailsent] = useState(false);
  const params = useParams();

  const sendMail = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mailSentStatus = await authFetch(
      `${process.env.NEXT_BACKEND_API_URL}/users/checkmail`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((body) => (body.status === "success" ? true : false));

    if (mailSentStatus) setMailsent(true);
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
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Forgot Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={sendMail}
            action="#"
            method="POST"
            className="space-y-6"
          >
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
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Send Mail
              </button>
            </div>
            {mailsent && (
              <p className="text-center text-sm text-green-500">
                Please check your mail!
              </p>
            )}
          </form>
          <div className="mt-4">
            <p className="mt-10 text-center text-sm/6 text-gray-400">
              Not a member?{" "}
              <Link
                className="font-semibold text-indigo-400 hover:text-indigo-300"
                href={"/signup"}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
