// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         await mongoose.connect("mongodb://localhost:27017/MEDITOKEN");
//         console.log("Database Connected Successfully");
//     } catch (err) {
//         console.log("Database Connection Failed:", err.message);
//     }
// };

// module.exports = connectDB;



const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log("Database Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;