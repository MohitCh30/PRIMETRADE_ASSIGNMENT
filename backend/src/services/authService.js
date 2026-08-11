const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModel");
const { generateToken } = require("../utils/jwt");
const { toSafeUser } = require("../utils/serializers");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const registerUser = async (name, email, password) => {
  const normalizedEmail = normalizeEmail(email);

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await createUser(name, normalizedEmail, hash);

  const token = generateToken(user);

  return { user: toSafeUser(user), token };
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(normalizeEmail(email));

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  return { user: toSafeUser(user), token };
};

module.exports = {
  registerUser,
  loginUser,
};
