const { Router } = require("express")
const { protect } = require("../middleware/auth")
const { addCart, sendCart } = require("../controller/cart.controller")

const router = Router()

router.use(protect)

router.get("/send_cart", sendCart)
router.post("/add", addCart)


module.exports = router