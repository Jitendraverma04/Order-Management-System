import express from "express";
import cors from 'cors'
import Category from '../models/CategorySchema.js'
import bodyParser from "body-parser"

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



router.put('/updateCategoryStatus/:categoryId', async (req, res) => {
    try {
        
      console.log("updateCategoryStatus-api hits")
      
      const { categoryId } = req.params;
      const { status } = req.body;
      
    // const cate = await Category.findById(categoryId);
    // console.log(cate)
      const category = await Category.findByIdAndUpdate(
        categoryId,
        { categoryStatus: status },
        { new: true }
      );
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.status(200).json({ message: 'Category status updated successfully', category });
    } catch (error) {
      res.status(500).json({ message: 'Error updating category status', error });
    }
  });


  router.put('/updateItemStatus/:categoryName/:itemId', async (req, res) => {

    try {
      const { categoryName, itemId } = req.params;
      const { status } = req.body;
  
      console.log("Updating item status api hits...");
      // console.log("Category Name:", categoryName);
      // console.log("Item ID:", itemId);
  
      const category = await Category.findOne({ categoryName });
      if (!category) return res.status(404).json({ message: 'Category not found' });
  
      const item = category.items.id(itemId);
      if (!item) return res.status(404).json({ message: 'Item not found' });
  
      item.itemStatus = status;
      await category.save();
  
      res.status(200).json({ message: 'Item status updated successfully', item });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating item status', error });
    }
  });
  
  


  router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params; // Get the category ID from the URL parameters
  

      
      console.log("/delete/:categoryId api hits")
      // Find the category by ID and delete it
      const deletedCategory = await Category.findByIdAndDelete(id);
  
      // Check if the category was found and deleted
      if (!deletedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      // Respond with success message
      res.status(200).json({ success: true, message: 'Category deleted successfully', deletedCategory });
  
    } catch (error) {
      console.error('Error deleting category:', error);
      // Respond with a server error
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  });


  router.delete('/delete/:categoryId/:itemId', async (req, res) => {
    try {
      const { categoryId, itemId } = req.params;

      console.log("/delete/:categoryId/:itemId api hits")
  
      // Find the category and pull (remove) the item from its 'items' array
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { $pull: { items: { _id: itemId } } }, // Remove the item by its _id
        { new: true } // Return the updated category document
      );
  
      console.log("updatedCategory",updatedCategory)
      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      // Check if the item was actually removed (optional, but good for confirmation)
      const itemStillExists = updatedCategory.items.some(item => item._id.toString() === itemId);
      if (itemStillExists) {
          // This case should ideally not happen if $pull worked correctly, but good for debugging
          return res.status(500).json({ success: false, message: 'Failed to delete item from category array.' });
      }
  
      res.status(200).json({ success: true, message: 'Item deleted successfully from category.', updatedCategory });
    } catch (error) {
      console.error('Error deleting item from category:', error);
      res.status(500).json({ success: false, message: 'Server error during item deletion', error: error.message });
    }
  });
  

  export default router;