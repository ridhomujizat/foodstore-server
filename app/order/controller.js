const mongoose = require("mongoose");
const Order = require("./model");
const OrderItem = require("../order-item/model");
const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../delivery-addresses/model");
const { policyFor } = require("../policy");
const { subject } = require("@casl/ability");

async function store(req, res, next) {
  let policy = policyFor(req.user);

  if (!policy.can("create", "Order")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }

  try {
    let { delivery_fee, deliverty_address } = req.body;
    let items = await CartItem.find({ user: req.user._id }).populate("product");

    if (!items.length) {
      return res.json({
        error: 1,
        message: " Can not create order because you have no items in cart",
      });
    }

    let address = await DeliveryAddress.findOne({ _id: deliverty_address });

    let order = new Order({
      _id: new mongoose.Types.ObjectId(),
      status: "waiting_payment",
      delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: req.user._id,
    });

    let orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        name: item.product.name,
        qty: parseInt(item.qty),
        price: parseInt(item.product.price),
        order: order._id,
        product: item.product._id,
      }))
    );

    orderItems.forEach((item) => order.order_item.push(item));
    await order.save();
    await CartItem.deleteMany({ user: req.user._id });
    return res.json(order);
  } catch (err) {
    if (err && err.name == "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}

async function index(res, req, next) {
  let policy = policyFor(req.user);

  if (!policy.can("view", "Order")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }

  try {
    let { limit = 0, skip = 0 } = req.query;
    let count = await Order.find({ user: req.user._id }).countDocuments();

    let orders = await Order.find({ user: req.user_id })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("order_items")
      .sort("-createAt");

    return res.json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
  } catch (err) {
    if (err && err.name == "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
  }
}

module.exports = {
  store,
  index,
};
