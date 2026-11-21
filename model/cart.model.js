const mongoose = require("mongoose");

const cartModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    items: [
        {
        product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
        unique: true
     },
     quantity: {
        type: Number,
        required: true,
        min: 1
     }
    }
    ]
}, 
{
    timestamps: true,
    versionKey: false
},
)

module.exports = mongoose.model("cart", cartModel)