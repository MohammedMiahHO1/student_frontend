const express = require("express");
const nunjucks = require("nunjucks");

const studentRoutes = require("./routes/studentRoutes");
const { connectRedis } = require("./config/redisClient");

const app = express();
const path = require("path");

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);

nunjucks.configure("views", {
    autoescape: true,
    express: app
});


app.set("view engine", "njk");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", studentRoutes);

// app.listen(3000, () => {
//     console.log("Frontend running on http://localhost:3000");
// });

module.exports = app;