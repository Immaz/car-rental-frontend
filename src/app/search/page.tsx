"use client";
import React, { Suspense } from "react";
import SearchBody from "./search";

export default function Search() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchBody />
    </Suspense>
  );
}
