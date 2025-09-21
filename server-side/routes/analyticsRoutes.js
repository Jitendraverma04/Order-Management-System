import express from "express";
import Order from "../models/OrderSchema.js";
import { format } from "date-fns"; // Import format from date-fns for consistent date formatting

const router = express.Router();

// General Analytics Route
router.get("/", async (req, res) => {
  console.log("Analytics API hit");
  const { start, end } = req.query; // Expecting ISO strings from frontend

  try {
    let startDate, endDate;

    // Validate and parse datesnpm install date-fns
    if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);

      // Basic validation
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format provided." });
      }
    } else {
      // Default to today if no dates are provided (shouldn't happen with updated frontend)
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    console.log(`Fetching analytics from ${startDate} to ${endDate}`);

    const filteredOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $nin: ["cancelled", "pending"] }, // Exclude cancelled and pending orders
    }).sort({ createdAt: 1 }); // Sort by creation date for consistent charting

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = filteredOrders.length;

    const itemMap = {};
    const dailyMap = {};

    filteredOrders.forEach(order => {
      // Use 'YYYY-MM-DD' for chart data key to ensure consistent grouping
      const day = format(new Date(order.createdAt), 'yyyy-MM-dd');

      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, revenue: 0 };
      }
      dailyMap[day].revenue += order.totalPrice;

      order.items.forEach(item => {
        itemMap[item.itemName] = (itemMap[item.itemName] || 0) + item.quantity;
      });
    });

    const topItem = Object.entries(itemMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // Ensure chart data covers all days in the range, even if no sales occurred
    const chartData = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      chartData.push(dailyMap[dateString] || { date: dateString, revenue: 0 });
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
    // Sort chart data by date
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));


    res.json({
      summary: {
        totalRevenue,
        totalOrders,
        topItem,
      },
      orders: filteredOrders, // Send the full orders list for the table
      dailyBreakdown: chartData, // Consistent name with frontend expectation
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route for sending daily reports (e.g., via email/WhatsApp)
router.post("/send-daily-report", async (req, res) => {
  const { start, end } = req.body;

  try {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $nin: ["cancelled", "pending"] },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const itemMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        itemMap[item.itemName] = (itemMap[item.itemName] || 0) + item.quantity;
      });
    });

    const topItem = Object.entries(itemMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const report = {
      dateRange: `${format(startDate, 'dd/MM/yyyy')} to ${format(endDate, 'dd/MM/yyyy')}`,
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders: orders.length,
      topItem,
    };

    console.log("📊 Daily Report:");
    console.table(report);

    // In a real application, you would integrate Twilio/Nodemailer here
    // For example, to send an email:
    // sendEmail(adminEmail, "Daily Sales Report", generateReportHtml(report));

    res.json({ success: true, message: "Report generated successfully (check server console)." });
  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

export default router;