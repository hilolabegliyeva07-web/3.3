const { Router } = require("express")
const { getAllCategory, addCategory, updateCategory, deleteCategory } = require("../controller/category.controller")
const { protect, adminOnly } = require("../middleware/auth")

const router = Router()

router.get("/get_all", getAllCategory)
router.post("/add", protect, adminOnly, addCategory)
router.put("/update/:id", updateCategory)
router.delete("delete/:id", deleteCategory)

module.exports = router