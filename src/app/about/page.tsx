import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-6">
          About Immaz Car Rentals
        </h1>
        <p
          className="text-gray-600 max-w-2xl"
          style={{ margin: "auto", marginBottom: "20px", marginTop: "20px" }}
        >
          Welcome to <strong>Immaz Car Rentals</strong>. We provide affordable
          and reliable car rental services to make your journey smooth. Founded
          by <strong>Immaz</strong>, a computer engineer and entrepreneur, our
          mission is to combine technology and customer-first service for the
          best rental experience.
        </p>

        <section className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Quality Cars</h2>
            <p className="text-gray-600 text-sm">
              Well-maintained cars that ensure safety and comfort on every trip.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">About Immaz</h2>
            <p className="text-gray-600 text-sm">
              Immaz is a computer engineer and businessman passionate about
              innovation and customer satisfaction.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;
