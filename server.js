require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const authRouter = require("./router/auth.routes")
const categoryRouter = require("./router/category.routes")
const productRouter = require("./router/products.routes")
const cartRouter = require("./router/cart.routes")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const POST = process.env.POST || 300

app.use("/uploads", express.static("uploads"))


// router
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/category", categoryRouter)
app.use("/api/product", productRouter)
app.use("app/cart", cartRouter)

connectDB()

app.listen(POST, () => {
    console.log("Server is running at: " + POST);
})