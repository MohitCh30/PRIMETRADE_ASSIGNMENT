const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModel");
const { generateToken } = require("../utils/jwt");

const registerUser = async (name, email, password) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await createUser(name, email, hash);

  const token = generateToken(user);

  return { user, token };
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};