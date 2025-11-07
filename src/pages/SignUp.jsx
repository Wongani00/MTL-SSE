import React from "react";
import CompanyLogo from "../assets/mtl-logo-75.png";
const SignUp = () => {
  return (
    <div>
      <div class="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 mt-4 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
        <div class="w-full">
          <div class="flex flex-col items-center justify-center">
            <img src={CompanyLogo} alt="MTL Logo" />
            <h1 class="text-2xl font-md mt-2 text-gray-900">Sign Up</h1>
          </div>
          <div class="mt-8">
            <form action="">
              <div class="relative mt-6">
                <input
                  type="text"
                  name="email"
                  id="f-name"
                  placeholder="First Name"
                  class="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  autocomplete="NA"
                />
                <label
                  for="f-name"
                  class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  First Name
                </label>
              </div>
              <div class="relative mt-6">
                <input
                  type="text"
                  name="email"
                  id="surname"
                  placeholder="Surname"
                  class="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  autocomplete="NA"
                />
                <label
                  for="surname"
                  class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Surname
                </label>
              </div>
              <div class="relative mt-6">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  class="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  autocomplete="NA"
                />
                <label
                  for="email"
                  class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Email Address
                </label>
              </div>
              <div class="relative mt-6">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  class="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                />
                <label
                  for="password"
                  class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Password
                </label>
              </div>
              <div class="my-6">
                <button
                  type="submit"
                  class="w-full rounded-md bg-[midnightblue] px-3 py-2 text-white focus:bg-gray-600 focus:outline-none cursor-pointer duration-200 transition hover:font-semibold hover:scale-101"
                >
                  Register
                </button>
              </div>
              <p class="text-center text-sm text-gray-500">
                Already have an account yet?
                <a
                  href="#!"
                  class="font-semibold text-gray-600 ml-[3px] hover:underline hover:font-bold focus:text-gray-800 focus:outline-none"
                >
                  Sign in{" "}
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
