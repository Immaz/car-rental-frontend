/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Vehicle } from "./search/search";

export default function Home() {
  const [pickupDate, Setpickupdate] = useState("");
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    console.log(`backend api url : ${process.env.NEXT_PUBLIC_BACKEND_API_URL}`);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vehicles`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success") {
          // randomly selecting 3 vehicle here
          // for (let i = 0; i < 3; i++) {
          //   const rand = Math.random() * 3;
          // }
          setVehicles(json.data);
        }
      })
      .catch((err) => console.error("Error fetching vehicles:", err));
  }, []);
  return (
    <div>
      <Header />
      <section id="section-hero" className="hero-section">
        <div className="container">
          <h1 className="hero-title">Luxury Cars on Rent</h1>
          <div className="hero-content">
            <img
              src="images/135d140f5786166f512b55e2f4e35f33e60af240.png"
              alt="Luxury silver car"
              className="hero-car-image"
            />
            <form className="booking-form" method="GET" action="/search">
              {/* Pickup Location */}
              <div className="form-group">
                <label htmlFor="pickup-location">Pickup Location</label>
                <div className="input-with-icon ">
                  <input
                    type="text"
                    id="pickup-location"
                    name="location"
                    placeholder="Enter city or location"
                    defaultValue="Karachi"
                  />
                  <img
                    src="images/3311_307.svg"
                    alt="location icon"
                    className="invisible"
                  />
                </div>
              </div>

              {/* Pickup Date */}
              <div className="form-group">
                <label htmlFor="pickup-date">Pick-up Date</label>
                <div className="input-with-icon">
                  <input
                    type="date"
                    id="pickup-date"
                    name="pickupDate"
                    onChange={(e) => Setpickupdate(e.target.value)}
                  />
                  <img src="images/3311_308.svg" alt="calendar icon" />
                </div>
              </div>

              {/* Return Date */}
              <div className="form-group">
                <label htmlFor="return-date">Return Date</label>
                <div className="input-with-icon">
                  <input
                    type="date"
                    id="return-date"
                    name="returnDate"
                    min={pickupDate || undefined}
                  />
                  <img src="images/3311_309.svg" alt="calendar icon" />
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="form-group">
                <label htmlFor="vehicle-type">Vehicle Type</label>
                <div className="input-with-icon">
                  <select id="vehicle-type" name="type">
                    <option value="">Any</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="luxury">Luxury</option>
                  </select>
                  <img src="images/3311_307.svg" alt="dropdown icon" />
                </div>
              </div>

              {/* Price Range */}
              <div className="form-group">
                <label htmlFor="price-range">Price Range ($ per day)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="min-price"
                    name="minPrice"
                    placeholder="Min"
                    min={0}
                    className="w-20 border rounded p-1"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    id="max-price"
                    name="maxPrice"
                    placeholder="Max"
                    className="w-20 border rounded p-1"
                    max={0}
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <img
                  src="images/3311_312.svg"
                  alt="search icon"
                  className="h-4 w-4"
                />
                <span>Filter</span>
              </button>
            </form>
          </div>
        </div>
      </section>
      <section id="section-features" className="features-section">
        <div className="container">
          <h2 className="section-title">Featured Vehicles</h2>
          <p className="section-subtitle">
            Explore our selection of premium vehicles available for your next
            adventure.
          </p>
          <div className="features-grid">
            {vehicles.map((v: Vehicle) => (
              // insert the <article> above here
              <article key={v.id} className="car-card">
                <div className="card-image-container">
                  <img
                    src={
                      v.pictures.length > 0
                        ? v.pictures[0].url
                        : "images/placeholder.png"
                    }
                    alt={`${v.brand} ${v.model}`}
                    className="card-image"
                  />
                  <span className="status-badge">Available Now</span>
                  <span className="price-badge">${v.price}/day</span>
                </div>
                <div className="card-content">
                  <h3>
                    {v.brand} {v.model}
                  </h3>
                  <p className="car-model">
                    {v.category} {v.year}
                  </p>
                  <div className="car-specs">
                    <div className="spec-item">
                      <img src="images/3311_377.svg" alt="seats icon" />{" "}
                      {v.capacity} Seats
                    </div>
                    <div className="spec-item">
                      <img src="images/3311_381.svg" alt="fuel icon" /> {v.fuel}
                    </div>
                    <div className="spec-item">
                      <img src="images/3311_378.svg" alt="transmission icon" />{" "}
                      {v.transmission}
                    </div>
                    <div className="spec-item">
                      <img src="images/3311_383.svg" alt="location icon" />{" "}
                      {v.location}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <a href="/search" className="explore-btn">
            Explore all cars
            <img src="images/3311_232.svg" alt="arrow icon" />
          </a>
        </div>
      </section>

      <section id="section-cta-banner" className="cta-banner-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-content">
              <h2>Do You Own a Luxury Car?</h2>
              <p>
                Monetize your vehicle effortlessly by listing it on{" "}
                <strong>CarRental</strong>. We take care of insurance, driver
                verification, and secure payments — so you can earn passive
                income, stress-free.
              </p>
              <a href="/dashboard/addcar" className="btn-light">
                List your car
              </a>
            </div>
            <img
              src="images/78c560dd367f9b776e70da465aff5e9edd19bf9b.png"
              alt="White luxury car"
              className="cta-car-image"
            />
          </div>
        </div>
      </section>

      <section id="section-testimonials" className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Discover why discerning travelers choose StayVenture for their
            luxury accommodations around the world.
          </p>
          <div className="testimonials-grid">
            <article className="testimonial-card">
              <header className="testimonial-header">
                <img
                  src="images/0d6bf2e0e5066cc662cc46546fbc11e62286d114.png"
                  alt="Emma Rodriguez"
                  className="avatar"
                />
                <div className="author-info">
                  <p className="author-name">Emma Rodriguez</p>
                  <p className="author-location">Barcelona, Spain</p>
                </div>
              </header>
              <div className="rating">
                <img src="images/3311_246.svg" alt="star" />
                <img src="images/3311_248.svg" alt="star" />
                <img src="images/3311_250.svg" alt="star" />
                <img src="images/3311_252.svg" alt="star" />
                <img src="images/3311_254.svg" alt="star" />
              </div>
              <blockquote>
                <p>
                  {`I've used many booking platforms before, but none compare to
                  the personalized experience and attention to detail that
                  CarRental provides.`}
                </p>
              </blockquote>
            </article>
            <article className="testimonial-card">
              <header className="testimonial-header">
                <img
                  src="images/b5daff7499461bd2a689af8a3fa35f028d52de32.png"
                  alt="Emma Rodriguez"
                  className="avatar"
                />
                <div className="author-info">
                  <p className="author-name">Emma Rodriguez</p>
                  <p className="author-location">Barcelona, Spain</p>
                </div>
              </header>
              <div className="rating">
                <img src="images/3311_264.svg" alt="star" />
                <img src="images/3311_266.svg" alt="star" />
                <img src="images/3311_268.svg" alt="star" />
                <img src="images/3311_270.svg" alt="star" />
                <img src="images/3311_272.svg" alt="star" />
              </div>
              <blockquote>
                <p>
                  {`I've used many booking platforms before, but none compare to
                  the personalized experience and attention to detail that
                  CarRental provides.`}
                </p>
              </blockquote>
            </article>
            <article className="testimonial-card">
              <header className="testimonial-header">
                <img
                  src="images/b5daff7499461bd2a689af8a3fa35f028d52de32.png"
                  alt="Emma Rodriguez"
                  className="avatar"
                />
                <div className="author-info">
                  <p className="author-name">Emma Rodriguez</p>
                  <p className="author-location">Barcelona, Spain</p>
                </div>
              </header>
              <div className="rating">
                <img src="images/3311_282.svg" alt="star" />
                <img src="images/3311_284.svg" alt="star" />
                <img src="images/3311_286.svg" alt="star" />
                <img src="images/3311_288.svg" alt="star" />
                <img src="images/3311_290.svg" alt="star" />
              </div>
              <blockquote>
                <p>
                  {`I've used many booking platforms before, but none compare to
                  the personalized experience and attention to detail that
                  CarRental provides.`}
                </p>
              </blockquote>
            </article>
          </div>
        </div>
      </section>

      <section id="section-newsletter" className="newsletter-section">
        <div className="container">
          <h2 className="section-title">Never Miss a Deal!</h2>
          <p className="section-subtitle">
            Subscribe to get the latest offers, new collections, and exclusive
            discounts.
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button type="submit">Subscribe Now</button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
