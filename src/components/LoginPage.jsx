import  { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import socket from "../socket";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/auth/authActions";

function LoginPage() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await dispatch(
        loginUser({ email: formData.email, password: formData?.password })
      )
      toast.success(data.msg);
      localStorage.setItem("userId", data?.userData?._id);
      socket.emit("register", data?.userData?._id);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center">
      <div className="w-full p-8 max-w-md bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full focus:outline-none border rounded-md focus:ring-2 focus:ring-blue-500 mb-2 px-4 py-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full focus:outline-none border rounded-md focus:ring-2 focus:ring-blue-500 mb-4 px-4 py-3"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-800 transition text-white rounded-md py-2 px-4"
          >
            {" "}
            Login
          </button>
          <p className="mt-1 text-sm">
            Dont have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
