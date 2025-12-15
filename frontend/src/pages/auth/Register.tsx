/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import RegisterForm from "@/components/auth/RegisterForm";

function Register() {
  return (
    <main className="h-dvh p-6 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </main>
  );
}

export default Register;
