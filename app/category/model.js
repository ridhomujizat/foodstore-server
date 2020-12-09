const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let catagorySchema = Schema({
  name: {
    type: String,
    minlenght: [3, "Panjang nama kategori minimal 3 karekter"],
    maxlenght: [20, "Panjang nama kategori maximal 20 karakter"],
    required: [true, "Nama kategori harus diisi"],
  },
});

module.exports = model("Category", catagorySchema);
