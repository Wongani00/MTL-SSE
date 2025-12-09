import React, { useState, useEffect, useRef } from "react";
import CompanyLogo from "../assets/mtl-logo-75.png";
import { useAuth } from "../hooks/UseAuth";
import { NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const isRedirecting = useRef(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only auto-redirect if not in the middle of showing the redirect message
    if (user && !isRedirecting.current) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      setLoading(false);
      setRedirecting(true);
      isRedirecting.current = true;

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  if (user && !isRedirecting.current) {
    return null;
  }

  return (
    <div>
      <Helmet>
        <title>MTL SSE - Login</title>
        <meta name="description" content="Login to MTL SSE project tracker" />
        <meta property="og:title" content="MTL SSE | Login" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
          <div className="w-full">
            <div className="flex flex-col items-center justify-center">
              <img src={CompanyLogo} alt="MTL Logo" />
              <h1 className="text-2xl font-md text-gray-900 mt-4">
                welcome back
              </h1>
            </div>
            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <div className="relative mt-6">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email Address"
                    className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || redirecting}
                  />
                  <label
                    htmlFor="email"
                    className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                  >
                    email address
                  </label>
                </div>
                <div className="relative mt-6">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || redirecting}
                  />
                  <label
                    htmlFor="password"
                    className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                  >
                    password
                  </label>
                </div>

                <div className="mt-4 mb-4">
                  <button
                    type="submit"
                    disabled={loading || redirecting}
                    className="w-full rounded-md bg-[midnightblue] px-3 py-2 text-white cursor-pointer duration-200 transition hover:font-semibold hover:scale-101 focus:bg-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>

                {redirecting && (
                  <div className="m-1 bg-green-50 p-3">
                    <p className="text-green-600 text-sm text-center font-medium">
                      Succes! redirecting...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="m-1 p-3 bg-red-50 rounded-md">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}
                {/* <p className="text-center text-sm text-gray-500">
                Don't have an account?
                <NavLink
                  to="/register"
                  className="ml-1 font-medium text-blue-600 hover:text-blue-500"
                >
                  {" "}
                  register
                </NavLink>
              </p> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
