import { Suspense } from "react";
import SignUpClient from "./SignUpClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpClient />
    </Suspense>
  );
}