const express = require("express");
const cors = require("cors");

const app = express();
const analyzeRoute = require("./routes/analyze");
const chatRoute = require("./routes/chat");
const PORT = 5000;

app.use(cors());
app.use(express.json());
const authRoute = require("./routes/auth");
app.use("/auth", authRoute);
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});
app.use("/analyze", analyzeRoute);
app.use("/chat", chatRoute);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});