const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cloudinary = require("cloudinary")
const cors = require("cors");
const url = 'mongodb://127.0.0.1:27017/INTERNEXX';
// const url = process.env.MONGODB_URL;
const userRoute = require("./routes/userRoutes.js");
const postsRoute = require("./routes/postsRoutes.js");
app.use(express.json())
const fileUpload = require('express-fileupload');

mongoose.connect(url, { useNewUrlParser: true })
const con = mongoose.connection
con.on('open', () => {
    console.log('connected...')
});
app.use(fileUpload({
    useTempFiles: true
}));



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    // secure: true
});
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_NAME,
//     api_secret: process.env.CLOUDINARY_NAME,
//     // proxy: "http://172.16.199.40:8080",
//     // folder: "test-folder",
//     secure: false
// })

app.use(cors())
    // app.use('/aliens', alienRouter)
app.use("/internex/user", userRoute);
app.use("/internex/posts", postsRoute);

app.listen(5003, () => {
    console.log("server is running on port 5003...")
})