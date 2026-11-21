const Cart = require("../model/cart.model")
const Product = require("../model/products.model")

const sendCart = async (req, res) => {
    const cart = await Cart.findOne({user: req.user.id}).populate("items.product")

    res.json(cart || {user: req.user.id, items: []})
}


const addCart = async (req, res) => {
    const { productId, quantity } = req.body

    if(quantity < 1) {
        return res.status(400).json({
            message: "Mahsulot soni 1 tadan kam bo'lmasin"
        })
    }

    const foundProduct = await Product.findById(productId)

    if(!foundProduct) {
        return res.status(400).json({
            message: "Mahsulot topilmadi"
        })
    }

    if (foundProduct.inStock < quantity) {
        return res.status(400).json({
            message: "Mahsulot soni yetmaydi"
        })
    }

    let cart = await Cart.findOne({user: req.user.id})
    if (!cart) {
        cart = new Cart({user: req.user.id, items: []})
        cart.items.push({product: foundProduct, quantity})
        await cart.save()
        await sendCart(req, res)
    } else {
        const item = cart.items.find((item) => item.product.toString() === productId)

        if (item) {
            if (foundProduct.inStock < item.quantity + quantity) {
                return res.status(400).json({
                    message: "Mahsulot soni yetmaydi"
                })
            }
            item.quantity += quantity
        } else {
            cart.items.push({product: foundProduct, quantity})
        }

        await cart.save()
        await sendCart(req, res)
    }
}

module.exports = {
    sendCart,
    addCart
}