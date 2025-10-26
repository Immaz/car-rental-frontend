"use client";
export const dynamic = "force-dynamic";
import LoginElement from "./login";
import React, { Suspense } from "react";

const Login = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginElement />
    </Suspense>
  );
};

export default Login;
