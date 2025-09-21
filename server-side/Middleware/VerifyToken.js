import jwt from "jsonwebtoken";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "jitendraverma";

const authenticateToken = (req, res, next) => {
  console.log("🔐 Token Check");

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    console.log("✅ Token Verified:", user);
    next();
  });
};

export { authenticateToken };
