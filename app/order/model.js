const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Invoice = require("../invoice/model");

const orederSchema = Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: ["waiting_payment"],
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    delivery_address: {
      provinsi: { type: String, required: [true, "provinsi harus diisi"] },
      kabupaten: { type: String, required: [true, "Kabupaten harus diisi"] },
      kecamatan: { type: String, required: [true, "kecamatan harus diisi"] },
      kelurahan: { type: String, required: [true, "Kelurahan harus diisi"] },
      detail: { type: String },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order_items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: true }
);

orederSchema.plugin(AutoIncrement, { inc_field: "order_number" });

orederSchema.virtual("items_count").get(function () {
  return this.order_items.reducer((total, item) => {
    return total + parseInt(item.qty);
  }, 0);
});

orederSchema.post("save", async function () {
  let sub_total = this.order_items.reducer(
    (sum, item) => (sum += item.price * item.qty),
    0
  );

  let invoice = new Invoice({
    user: this.user,
    order: this._id,
    sub_total: sub_total,
    delevery_fee: parseInt(this.delevery_fee),
    total: parseInt(sub_total + this.delevery_fee),
    delivery_address: this.delivery_address,
  });

  await invoice.save();
});

module.exports = model("Order", orederSchema);
