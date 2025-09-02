import mongoose from "mongoose";

import { DB_URI , NODE_ENV } from "../config/env.js";

if(!DB_URI) {
    throw new Error("Please Define The MONGODB_URI Environment Variable Inside .env.<development/production>.local");
}

const connectDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected To Database In ${NODE_ENV} Mode`);
    } catch (error) {
        console.error(`Error Connecting To MongoDB: ${error.message}`);

        process.exit(1);
    }
}

export default connectDatabase;