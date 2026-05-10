import bcrypt from "bcryptjs";
import User from "../models/User.js";

const getAdminConfig = () => ({
  name: process.env.ADMIN_NAME?.trim() || "System Admin",
  email: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
  password: process.env.ADMIN_PASSWORD?.trim(),
});

export const getAdminEmail = () => getAdminConfig().email;

const seedAdmin = async () => {
  const adminConfig = getAdminConfig();

  if (!adminConfig.email || !adminConfig.password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env");
  }

  const hashedPassword = await bcrypt.hash(adminConfig.password, 10);

  await User.findOneAndUpdate(
    { email: adminConfig.email },
    {
      name: adminConfig.name,
      email: adminConfig.email,
      password: hashedPassword,
      role: "admin",
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log(`Admin account ready: ${adminConfig.email}`);
};

export default seedAdmin;
