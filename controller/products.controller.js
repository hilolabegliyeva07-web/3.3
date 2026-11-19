const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const productsModel = require("../model/products.model");
const categoryModel = require("../model/category.model");

const deleteImage = (image) => {
  if (!image) return;
  const filePath = path.join(__dirname, "..", "uploads", path.basename(image));
  fs.unlink(filePath, () => {});
};

const getAllProducts = async (req, res) => {
  const { category, title } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (title) filter.title = { $regex: title, $options: "i" };

  const products = await productsModel
    .find(filter)
    .populate("category", "title")
    .sort({ createdAt: -1 });

  res.json(products);
};

const addProduct = async (req, res) => {
  const { title, description, price, inStock, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    if (!title || !mongoose.isValidObjectId(category)) {
      deleteImage(image);
      return res
        .status(400)
        .json({ message: "Title yoki category id noto'g'ri" });
    }

    const foundedCategory = await categoryModel.findById(category);
    if (!foundedCategory) {
      deleteImage(image);
      return res.status(404).json({ message: "Category topilmadi" });
    }

    const existing = await productsModel.findOne({ title, category });

    if (existing) {
      deleteImage(image);
      return res
        .status(409)
        .json({ message: "Bunday mahsulot allaqachon mavjud" });
    }

    await productsModel.create({
      title,
      description,
      price,
      inStock,
      category,
      image,
    });

    res.status(201).json({ message: "Mahsulot qo'shildi" });
  } catch (error) {
    deleteImage(image);
    throw error;
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, inStock, category } = req.body;
  const newImage = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    if (!mongoose.isValidObjectId(id)) {
      deleteImage(newImage);
      return res.status(400).json({ message: "Mahsulot id noto'g'ri" });
    }

    const foundedProduct = await productsModel.findById(id);
    if (!foundedProduct) {
      deleteImage(newImage);
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }

    if (category !== undefined) {
      if (
        !mongoose.isValidObjectId(category) ||
        !(await categoryModel.findById(category))
      ) {
        deleteImage(newImage);
        return res.status(404).json({ message: "Category topilmadi" });
      }
    }

    const finalTitle = title !== undefined ? title : foundedProduct.title;
    const finalCategory =
      category !== undefined ? category : foundedProduct.category;

    const duplicate = await productsModel.findOne({
      _id: { $ne: id },
      title: finalTitle,
      category: finalCategory,
    });
    if (duplicate) {
      deleteImage(newImage);
      return res
        .status(409)
        .json({ message: "Bunday mahsulot allaqachon mavjud" });
    }

    const oldImage = foundedProduct.image;

    if (title !== undefined) foundedProduct.title = title;
    if (description !== undefined) foundedProduct.description = description;
    if (price !== undefined) foundedProduct.price = price;
    if (inStock !== undefined) foundedProduct.inStock = inStock;
    if (category !== undefined) foundedProduct.category = category;
    if (newImage) foundedProduct.image = newImage;

    await foundedProduct.save();

    if (newImage) deleteImage(oldImage); 

    res.status(200).json({ message: "Mahsulot o'zgartirildi" });
  } catch (error) {
    deleteImage(newImage);
    throw error;
  }
};

const deleteProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Mahsulot id noto'g'ri" });
  }

  const product = await productsModel.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Mahsulot topilmadi" });
  }

  deleteImage(product.image);
  res.status(200).json({ message: "Mahsulot o'chirildi" });
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  deleteImage,
};
