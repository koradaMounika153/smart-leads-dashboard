import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;