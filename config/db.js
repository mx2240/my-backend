// // db.js
// const mongoose = require("mongoose");

// let isConnected = false;

// const connectDB = async () => {
//     if (isConnected) return;
//     await mongoose.connect(process.env.MONGO_URI);
//     isConnected = true;
//     console.log("MongoDB connected");
// };

// module.exports = connectDB;


// db.js
const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(mongoose => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectDB;
