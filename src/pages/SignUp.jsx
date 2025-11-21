import React from "react";
import CompanyLogo from "../assets/mtl-logo-75.png";
import { NavLink } from "react-router-dom";
const SignUp = () => {
  return (
    <div>
      <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 mt-4 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            <img src={CompanyLogo} alt="MTL Logo" />
            <h1 className="text-2xl font-md mt-2 text-gray-900">Sign Up</h1>
          </div>
          <div className="mt-8">
            <form action="">
              <div className="relative mt-6">
                <input
                  type="text"
                  name="email"
                  id="f-name"
                  placeholder="First Name"
                  className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  autocomplete="NA"
                />
                <label
                  for="f-name"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  First Name
                </label>
              </div>
              <div claclassNamess="relative mt-6">
                <input
                  type="text"
                  name="email"
                  id="surname"
                  placeholder="Surname"
                  className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  autocomplete="NA"
                />
                <label
                  for="surname"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Surname
                </label>
              </div>
              <div className="relative mt-6">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  autocomplete="NA"
                />
                <label
                  for="email"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Email Address
                </label>
              </div>
              <div className="relative mt-6">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                />
                <label
                  for="password"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Password
                </label>
              </div>
              <div className="my-6">
                <button
                  type="submit"
                  className="w-full rounded-md bg-[midnightblue] px-3 py-2 text-white focus:bg-gray-600 focus:outline-none cursor-pointer duration-200 transition hover:font-semibold hover:scale-101"
                >
                  Register
                </button>
              </div>
              <p className="text-center text-sm text-gray-500">
                Already have an account?
                <NavLink
                  to="/login"
                  className="ml-1 font-medium text-blue-600 hover:text-blue-500"
                >
                  {" "}
                  login
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
