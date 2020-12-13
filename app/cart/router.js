const router = require("express").Router();
const multer = require("multer");

const cartController = require("./controller");

router.put("/carts", multer().none(), cartController.update);

module.exports = router;
