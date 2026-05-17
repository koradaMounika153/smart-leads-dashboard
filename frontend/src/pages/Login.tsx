function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4"
        />

        <button className="bg-black text-white w-full p-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;