const jwt = require("jsonwebtoken");
const authModel = require("../model/auth.model");

const protect = async (req, res, next) => {

    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Token topilmadi"
        });
    }

    const token = authorization.split(" ")[1]
    if (authorization.split(" ")[0] !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token topilmadi" });
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        req.user = await authModel.findById(decode.id)``

    } catch (error) {
    return res.status(500).json({
        message: error.message
    });
  }

  next()
}


const adminOnly = async (req, res, next) => {
    if (!req.user.role !== "admin") {
      return res.status(401).json({ message: "Faqat adminlar uchun" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Sizda bu amal uchun ruxsat yo'q" });
    }

    next();
  };

module.exports = { protect, adminOnly };