import React, { Suspense } from "react";

const Payment = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Payment />
    </Suspense>
  );
};

export default Payment;
