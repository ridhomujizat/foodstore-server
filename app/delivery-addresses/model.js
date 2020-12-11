const mongoose = require("mongoose");
const { policyFor } = require("../policy");
const { model, Schema } = mongoose;
const { subject } = require("@casl/ability");

const deliveryAddressSchema = Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama alamat harus diisi"],
      maxlenght: [255, "Panjang maksimal nama alamat adalah 255 karakter"],
    },
    kelurahan: {
      type: String,
      required: [true, "Kelurahan harus diisi"],
      maxlenght: [255, "Panjang maksimal kelurahan adalah 255"],
    },
    kecamatan: {
      type: String,
      required: [true, "Kecamatan harus diisi"],
      maxlenght: [255, "Panjang maksimal kecamatan adalah 255"],
    },
    kabupaten: {
      type: String,
      required: [true, "Kabupaten harus diisi"],
      maxlenght: [255, "Panjang maksimal provinsi adalah 255 karakter"],
    },
    provinsi: {
      type: String,
      required: [true, "Provinsi harus diisi"],
      maxlenght: [255, "Panjang maksimal provinsi adalah 255 karakter"],
    },
    detail: {
      type: String,
      required: [true, "Detail alamat harus diisi"],
      maxlenght: [1000, "Panjang maksimal detail alamat adalaha 1000 karekter"],
    },
  },
  { timestamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);
