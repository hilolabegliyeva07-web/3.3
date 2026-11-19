const { Router } = require("express");
const uploads = require("../middleware/upload"); // fayl joylashuviga moslang
const { addProduct, getAllProducts, updateProduct, deleteProduct } = require("../controller/products.controller");

const router = Router();

router.get("/get_all", getAllProducts)
router.post("/add", uploads.single("image"), addProduct);
router.put("/update/:id", uploads.single("image"), updateProduct)
router.delete("/delete/:id", uploads.single("image"), deleteProduct);

module.exports = router;