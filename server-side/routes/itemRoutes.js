import express from "express";
import cors from 'cors'
import Category from '../models/CategorySchema.js'
import Order from '../models/OrderSchema.js'
import bodyParser from "body-parser"
import dayjs from "dayjs";

const router = express.Router();


router.use(bodyParser.json());
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));





import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });



const defaultCategoryImages = {
  pizza: "/uploads/PizzaLogo.jpg",
  burger: "/uploads/BurgerLogo.jpg",
  coldcoffee: "/uploads/ColdCoffeeLogo.jpg",
  maggie: "/uploads/MaggieLogo.jpg",
  sandwich: "/uploads/SandwichLogo.jpg",
};


router.post('/additem',upload.fields([{ name: "itemImage" }, { name: "categoryImage" }]), async (req, res) => {
  console.log("additem api hit")
  // console.log(req.body); 
  // console.log(req.files); 
    const { category, itemName, price, description, } = req.body;
  
     Number(price);
    if (isNaN(price)) {
      return res.status(400).json({ message: "Invalid price value." });
    };

    if (!category || category.trim() === "") {
      return res.status(400).json({ message: "Category is required." });
    }

    const updatedCategory=category.toLowerCase().trim();

    // console.log(updatedCategory)
  
    const categoryImage = req.files["categoryImage"]
    ? req.files["categoryImage"][0].path
    : defaultCategoryImages[updatedCategory] || null;


   // console.log("categoryimg",categoryImage)

  const itemImage = req.files["itemImage"]
    ? req.files["itemImage"][0].path
    : null;
    

        try {
        let existingCategory = await Category.findOne({ categoryName: updatedCategory });
    
        if (existingCategory) {
            console.log("Category exists, adding item...");
            
    
            existingCategory.items.push({ itemName, price, description,itemImage });
    
            await existingCategory.save();
        } else {
            console.log("Creating new category...");
            
            const newCategory = new Category({
            categoryName: updatedCategory,
            categoryImage:categoryImage,
            items: [{ itemName, price, description,itemImage }]
            });
    
            await newCategory.save();
        }
    
        res.status(200).json({ message: "Item added successfully!" });
        } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ message: "Server Error" });
        }
  });
  




  // router.get("/getitems/:category", async (req, res) => {
  //   try {
  //     console.log("/getitems/:category API hit");
  //     // console.log("req.params:", req.params); 
  
  //     const { category } = req.params;
  
  //     // console.log(category)
  
  //     const categoryData = await Category.findOne({ categoryName: category });
  
  //     if (!categoryData) {
  //       return res.status(404).json({ error: "Category not found" });
  //     }
  
  //     // console.log("Fetched items:", categoryData.items);
  //     res.json({ items: categoryData.items }); 
  //   } catch (error) {
  //     console.error("Error fetching category items:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });
  
  


  // router.get("/menudata", async (req, res) => {
  //   console.log("Fetching all categories...");
  
  //   try {
  //     const categoryData = await Category.find();
  //     res.status(200).json({ success: true, categoryData });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     res.status(500).json({ success: false, message: "Server Error" });
  //   }
  // });
  




router.get("/historyOrders", async (req, res) => {

  console.log("historyOrders api calls")
    try {
      const orderData = await Order.find();
      res.json({ success: true, orderData});
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });



  

  

  router.put("/updateOrderStatus", async (req, res) => {
    const { orderId, status } = req.body;

    console.log("updateOrderStatus API hit:", { orderId, status }); // More descriptive log

    // Basic validation
    if (!orderId || !status) {
        return res.status(400).json({ success: false, message: "Order ID and status are required." });
    }

    // Validate if the status is one of the allowed enums
    const allowedStatuses = ['pending', 'done', 'cancelled', 'cancel'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status provided." });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true } // Returns the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        res.status(200).json({ success: true, message: "Order status updated successfully.", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Failed to update order status." });
    }
});





import PDFDocument from 'pdfkit';

router.get('/generate-bill/:orderId', async (req, res) => {
  try {
      const { orderId } = req.params;

      // 1. Fetch the order from the database
      const order = await Order.findById(orderId);

      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Helper function to format currency and handle invalid numbers gracefully
      const formatCurrency = (amount) => {
          const value = parseFloat(amount);
          if (isNaN(value)) {
              return '$0.00'; // Return a default value if the number is invalid
          }
          return `$${value.toFixed(2)}`;
      };

      // 2. Set up the PDF document and response headers
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `Bill_Order_${orderId}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // IMPORTANT: Handle errors on the PDF document stream to prevent write-after-end
      doc.on('error', (err) => {
          console.error("PDF generation error:", err);
          // Check if headers have already been sent to avoid sending a second response
          if (!res.headersSent) {
              res.status(500).json({ message: 'Error generating PDF' });
          }
      });

      // Pipe the PDF document to the response stream
      doc.pipe(res);

      // Manually manage the vertical position to avoid NaN errors
      let yPosition = 50;
      const lineSpacing = 20;

      // 3. Add content to the PDF
      // Header with Cafe Name
      yPosition += 20;
      doc.fontSize(20).fillColor('#8B4513').text('Demo For Cafe', 50, yPosition, { align: 'center' });
      yPosition += 20;
      doc.fontSize(12).fillColor('#6c757d').text('Thank You For Your Order!', 50, yPosition, { align: 'center' });
      yPosition += 20;
      doc.strokeColor('#ccc').lineWidth(1).moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 20;

      // Order Details
      doc.fontSize(12).fillColor('#2c2c2c')
         .text(`Order ID: #${order._id}`, 50, yPosition, { continued: true, align: 'left' })
         .text(`Date: ${dayjs(order.createdAt).format('DD/MM/YYYY')}`, 50, yPosition, { align: 'right' });
      yPosition += lineSpacing;

      doc.text(`Customer Name: ${order.customerName}`, 50, yPosition);
      yPosition += lineSpacing;
      doc.text(`Phone: ${order.customerPhone}`, 50, yPosition);
      yPosition += lineSpacing;
      yPosition += lineSpacing;

      // Items Table
      const itemX = 50;
      const quantityX = 350;
      const priceX = 450;
      doc.font('Helvetica-Bold')
         .text('Items', itemX, yPosition)
         .text('Quantity', quantityX, yPosition)
         .text('Price', priceX, yPosition, { align: 'right' });
      yPosition += 10; // Extra space after table header
      doc.font('Helvetica');

      let calculatedTotal = 0; // Initialize a variable to calculate the total
      order.items.forEach(item => {
          yPosition += lineSpacing;
          // Added check to ensure price and quantity are valid numbers before calculation
          const itemPrice = parseFloat(item.price);
          const itemQuantity = parseInt(item.quantity, 10);
          const totalItemPrice = isNaN(itemPrice) || isNaN(itemQuantity) ? 0 : itemPrice * itemQuantity;

          // Add the item's price to the calculated total
          calculatedTotal += totalItemPrice;

          doc.text(item.itemName, itemX, yPosition);
          doc.text(`x${itemQuantity}`, quantityX, yPosition);
          doc.text(formatCurrency(totalItemPrice), priceX, yPosition, { align: 'right' });
      });

      yPosition += 20; // Extra space after items
      doc.strokeColor('#ccc').lineWidth(1).moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 20;

      // Total
      doc.font('Helvetica-Bold').fontSize(14)
         .text('Total:', 50, yPosition)
         .text(formatCurrency(calculatedTotal), 450, yPosition, { align: 'right' });
      yPosition += 20;

      // Footer
      yPosition += 20;
      doc.fontSize(10).text('Thank you for dining with us!', 50, yPosition, { align: 'center' });

      // Finalize the document and end the stream
      doc.end();

  } catch (error) {
      console.error("Error generating bill:", error);
      // This catch block will handle errors that are not related to the PDF stream itself.
      // The PDF stream errors are handled by the doc.on('error') listener.
      // We check if headers are already sent to prevent sending a second response.
      if (!res.headersSent) {
          res.status(500).json({ message: 'Internal Server Error' });
      }
  }
});

export default router;
