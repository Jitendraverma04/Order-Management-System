import express from "express";
import cors from 'cors'
import Category from '../models/CategorySchema.js'
import bodyParser from "body-parser"

import Order from '../models/OrderSchema.js'

const router = express.Router();


router.use(bodyParser.json());
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.get("/getitems/:category", async (req, res) => {
    try {
      console.log("/getitems/:category API hit-1");
      // console.log("req.params:", req.params); 
  
      const { category } = req.params;
  
      // console.log(category)
  
      const categoryData = await Category.findOne({ categoryName: category });
  
      if (!categoryData) {
        return res.status(404).json({ error: "Category not found" });
      }
  
      // console.log("Fetched items:", categoryData.items);
      res.json({ items: categoryData.items }); 
    } catch (error) {
      console.error("Error fetching category items:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  


  router.get("/menudata", async (req, res) => {
    console.log("Fetching all categories-1...");
  
    try {
      const categoryData = await Category.find();
      res.status(200).json({ success: true, categoryData });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });

  

  router.post("/confirmOrder", async (req, res) => {

    console.log("confirmOrder api hits")
    
    try {
      const {
        customerName,
        customerPhone,
        tableId,
        items,
        totalPrice,
      } = req.body;
  
      if (!customerName || !customerPhone || !tableId || !items || !totalPrice) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      const newOrder = new Order({
        customerName,
        customerPhone,
        tableId,
        items,
        totalPrice,
      });
  
      await newOrder.save();
  
      res.status(201).json({ success: true, message: "Order saved successfully" });
    } catch (error) {
      console.error("Error saving order:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });


  export default router;