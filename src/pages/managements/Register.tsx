import { useState } from "react";

export const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Register</h1>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border-2 border-gray-300 rounded-md p-2"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        className="border-2 border-gray-300 rounded-md p-2"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        className="border-2 border-gray-300 rounded-md p-2"
      />
      <button type="submit">Register</button>
    </div>
  );
};
