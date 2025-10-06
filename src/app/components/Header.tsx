"use client";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";

function Logout() {
  localStorage.clear();
  window.location.href = "/";
}
const Header = () => {
  const pathname = usePathname();
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    // if role is guest he cant access dashboard/*
    if (!storedToken && pathname.startsWith("/dashboard")) {
      redirect("/signup");
    }
    // if role is customer he can access dashboard/managebooking only
    if (
      role === "customer" &&
      (pathname.startsWith("/dashboard/addcar") ||
        pathname.startsWith("/dashboard/managecars") ||
        pathname === "/dashboard")
    ) {
      redirect("/dashboard/managebookings");
    }
    setToken(storedToken as any);
    setRole(role as any);
  }, []);
  return (
    <section id="section-header">
      <header className="site-header container">
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <Link href="/" className="logo">
          <img src="/images/3311_217.svg" alt="CarRental favicon" />
          <span>CarRental</span>
        </Link>
        <nav className="main-nav">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/search">Cars</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/dashboard/managebookings">My Bookings</Link>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <form className="search-form-header" method="GET" action={"/search"}>
            <input type="text" name="q" placeholder="Search cars" />
            <button type="submit" aria-label="Search">
              <img src="/images/3311_212.svg" alt="Search Icon" />
            </button>
          </form>
          {role && role !== "customer" && (
            <Link href="/dashboard/addcar" className="list-cars-link">
              List cars
            </Link>
          )}
          {token ? (
            <div className="btn btn-primary cursor-pointer" onClick={Logout}>
              Logout
            </div>
          ) : (
            <Link href="/signup" className="btn btn-primary">
              Sign up
            </Link>
          )}
        </div>
      </header>
    </section>
  );
};

export default Header;
