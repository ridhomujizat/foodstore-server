const mongoose = require("mongoose");

const { model, Schema } = mongoose;

const tagSchema = Schema({
  name: {
    type: String,
    minlenght: [3, "Panjang nama tag mininmal 3 karakter"],
    maxlenght: [20, "Panjang nama tag maximal 20 karakter"],
    required: [true, " Nama kategori harus diisi"],
  },
});

module.exports = model("Tag", tagSchema);
