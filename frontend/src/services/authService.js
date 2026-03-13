import API from "../api/api";

export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};