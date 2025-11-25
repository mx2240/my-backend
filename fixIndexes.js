const mongoose = require("mongoose");
require("dotenv").config();

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const collection = mongoose.connection.collection("students");

        console.log("Current indexes:");
        console.log(await collection.indexes());

        if ((await collection.indexes()).some(idx => idx.name === "user_1")) {
            await collection.dropIndex("user_1");
            console.log("❌ Dropped invalid index: user_1");
        } else {
            console.log("No invalid user_1 index found");
        }

        process.exit(0);
    } catch (err) {
        console.error("🔥 Error:", err.message);
        process.exit(1);
    }
}

fix();
