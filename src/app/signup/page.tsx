"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../Firebase";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password);
    router.push("/signin");
  };

  return (
    <><div className="bg"></div>
    <div className="bg bg2"></div>
    <div className="bg bg3"></div>

    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white pb-6">
          Create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white" // Updated text color
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-lg border-gray-300 bg-white py-2 px-4 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white" // Updated text color
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-lg border-gray-300 bg-white py-2 px-4 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white" // Updated text color
              >
                Verify Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="passwordAgain"
                name="passwordAgain"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPasswordAgain(e.target.value)}
                required
                className="block w-full rounded-lg border-gray-300 bg-white py-2 px-4 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              disabled={
                !email ||
                !password ||
                !passwordAgain ||
                password !== passwordAgain
              }
              onClick={() => signup()}
              className="cursor-pointer disabled:opacity-40 flex w-full justify-center rounded-lg bg-black px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Sign Up
            </button>
          </div>
          <p className="mt-4 text-center text-white">
          Already a member?{" "}
          <button
            onClick={() => router.push("/signin")}
            className="cursor-pointer font-semibold leading-6 text-pink-500 hover:text-pink-600"
          >
            Sign In
          </button>
        </p>
        </div>
      </div>
      
      
    </div>
  </>
);
}