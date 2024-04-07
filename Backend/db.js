const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://20pa1a05a8:Onlyme-143@cluster0.r3t14kn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectToMongo;
