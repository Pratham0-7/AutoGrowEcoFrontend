import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company_name: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate FIRST
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.company_name === ""
    ) {
      alert("Please enter all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("company_id", data.company_id);
        localStorage.setItem("name", data.name);
        localStorage.setItem("company_name", data.company_name);
        navigate("/dashboard");
      } else {
        alert(data.message || "Error occurred");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h2 className="text-2xl font-bold">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="p-2 text-white"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="p-2 text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="p-2 text-white"
        />

        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          onChange={handleChange}
          className="p-2 text-white"
        />

        <button className="bg-green-500 text-white p-2 font-semibold">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
