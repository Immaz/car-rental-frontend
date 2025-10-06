"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableColumns,
  faSquarePlus,
  faCarSide,
  faClipboardList,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    setToken(storedToken as any);
    setRole(role as any);
    setName(name as any);
  }, []);
  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 p-5 hidden md:flex flex-col">
      <div className="flex flex-col items-center text-center mt-4 mb-10">
        <img
          src="/images/user_outlined.png"
          alt={name}
          className="h-14 w-14 rounded-full mb-2"
        />
        <h2 className="font-outfit text-base text-gray-700/80">{name}</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {role && role !== "customer" && (
          <Link
            href="/dashboard"
            className={`group flex items-center gap-3 rounded-md px-3 py-2.5 ${
              pathname === "/dashboard"
                ? "bg-blue-100/50 text-blue-600 font-medium"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
            }`}
          >
            <FontAwesomeIcon icon={faTableColumns} className="h-5 w-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        )}

        {role && role !== "customer" && (
          <Link
            href="/dashboard/addcar"
            className={`group flex items-center gap-3 rounded-md px-3 py-2.5 ${
              pathname === "/dashboard/addcar"
                ? "bg-blue-100/50 text-blue-600 font-medium"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
            }`}
          >
            <FontAwesomeIcon icon={faSquarePlus} className="h-5 w-5" />
            <span className="text-sm font-medium">Add Car</span>
          </Link>
        )}
        {role && role !== "customer" && (
          <Link
            href="/dashboard/managecars"
            className={`group flex items-center gap-3 rounded-md px-3 py-2.5 ${
              pathname === "/dashboard/managecars"
                ? "bg-blue-100/50 text-blue-600 font-medium"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
            }`}
          >
            <FontAwesomeIcon icon={faCarSide} className="h-5 w-5" />
            <span className="text-sm font-medium">Manage Cars</span>
          </Link>
        )}

        <Link
          href="/dashboard/managebookings"
          className={`group flex items-center gap-3 rounded-md px-3 py-2.5 ${
            pathname === "/dashboard/managebookings"
              ? "bg-blue-100/50 text-blue-600 font-medium"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
          }`}
        >
          <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5" />
          <span className="text-sm font-medium">Manage Bookings</span>
        </Link>
        {role == "admin" && (
          <Link
            href="/dashboard/manageusers"
            className={`group flex items-center gap-3 rounded-md px-3 py-2.5 ${
              pathname === "/dashboard/manageusers"
                ? "bg-blue-100/50 text-blue-600 font-medium"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
            }`}
          >
            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
            <span className="text-sm font-medium">Manage Users</span>
          </Link>
        )}
      </nav>
    </aside>
  );
}
