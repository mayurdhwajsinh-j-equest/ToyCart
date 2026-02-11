//  import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.DATABASE_URL);
//     console.log("MongoDB connected:", conn.connection.host);
//     return conn;
//   } catch (error) {
//     console.error("Database connection error:", error);
//     process.exit(1);
//   }
// };

// export const db = {};