import { useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [useremail, setUseremail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handlers for input fields
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCpasswordChange = (e) => {
    setCpassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setUseremail(e.target.value);
  };

  // Validate input fields
  const validate = () => {
    let errors = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    if (!cpassword) errors.cpassword = "Confirm password is required";
    if (password !== cpassword) errors.cpassword = "Passwords do not match";
    if (!useremail) errors.useremail = "Email is required";
    if (!/\S+@\S+\.\S+/.test(useremail)) errors.useremail = "Email is invalid";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const userData = {
      username: username,
      password: password,
      email: useremail,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://todo-fullstack-zcsg.onrender.com/signup",
        userData
      );
      console.log("Response:", response.data);
      alert(response.data.message);
      setUsername("");
      setPassword("");
      setCpassword("");
      setUseremail("");
      setErrors({});
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 bg-orange-400 py-52">
      <h1 className="text-3xl font-semibold text-center">
        Signup Now to maintain Todo Activity
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col mt-5 w-96">
        <label htmlFor="username" className="my-5">
          Username
        </label>
        <input
          type="text"
          onChange={handleUsernameChange}
          value={username}
          className="p-2"
          placeholder="Enter username"
        />
        {errors.username && <span className="text-red-600">{errors.username}</span>}
        <label htmlFor="password" className="my-5">
          Password
        </label>
        <input
          type="password"
          onChange={handlePasswordChange}
          value={password}
          className="p-2"
          placeholder="Enter the password"
        />
        {errors.password && <span className="text-red-600">{errors.password}</span>}
        <label htmlFor="cpassword" className="my-5">
          Confirm Password
        </label>
        <input
          type="password"
          onChange={handleCpasswordChange}
          value={cpassword}
          className="p-2"
          placeholder="Enter the Confirm password"
        />
        {errors.cpassword && <span className="text-red-600">{errors.cpassword}</span>}
        <label htmlFor="email" className="my-5">
          Email
        </label>
        <input
          type="email"
          className="p-2"
          placeholder="Enter the email"
          onChange={handleEmailChange}
          value={useremail}
        />
        {errors.useremail && <span className="text-red-600">{errors.useremail}</span>}
        <input
          className="p-2 my-5 text-white bg-black"
          type="submit"
          value={loading ? "Signing Up..." : "Sign Up"}
          disabled={loading}
        />
      </form>
      <p>After signup please <Link to="/">Login</Link></p>
    </div>
  );
};

export default Signup;
