import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [loginusername, setLoginusername] = useState("");
  const [loginpassword, setLoginpassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const usernamechange = (e) => {
    setLoginusername(e.target.value);
  };

  const passwordchange = (e) => {
    setLoginpassword(e.target.value);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!loginusername || !loginpassword) {
      setError("Username and password are required");
      return;
    }

    const logindata = {
      lusername: loginusername,
      lpassword: loginpassword,
    };

    try {
      const response = await axios.post("https://todo-fullstack-zcsg.onrender.com/login", logindata);
      console.log("Response:", response.data);
      alert(response.data.message);

      if (response.data.message === "Login successful") {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 bg-orange-400 py-52">
      <h1 className="text-3xl font-semibold text-center ">
        Login Now To Access and maintain Todo Activity
      </h1>
      <form action="" className="flex flex-col mt-5 w-96">
        <label htmlFor="username" className="my-5">
          Username
        </label>
        <input
          type="text"
          className="p-2"
          placeholder="Enter username"
          onChange={usernamechange}
        />
        <label htmlFor="password" className="my-5">
          Password
        </label>
        <input
          type="password"
          className="p-2"
          placeholder="Enter the password"
          onChange={passwordchange}
        />
        {error && <span className="text-red-600">{error}</span>}
        <input
          className="p-2 my-5 text-white bg-black"
          type="submit"
          value="Login"
          onClick={handlesubmit}
        />
      </form>
      <p>Don't have please <Link to="/signup">Signup</Link></p>
    </div>
  );
};

export default Login;
