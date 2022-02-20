const mongoose = require("mongoose");

//schema
const testSchema = new mongoose.Schema({
  test: { type: String, required: true },
});

const Test = mongoose.model("Test", testSchema);

module.exports.Test = Test;
