const mongoose = require("mongoose");
require("dotenv").config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error`);
        process.exit(1); // Exit with a non-zero status code to indicate an error
    }
};

module.exports = connectDB;