//required("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const {userRouter, blogRouter} = require("./routes");    // routes폴더의 index 불러옴
//const {userRouter} = require("./routes/userRoute");
//const {blogRouter} = require("./routes/blogRoute");
//onst {commentRouter} = require("./routes/commentRoute");
const app = express();
//const {MONGO_URI, PORT} = process.env;
//const {} = required("./src/middleware/authentication");
//const {generateFakeData} = require("../faker");
const {generateFakeData} = require("../faker2");

const MONGO_URI = 'mongodb+srv://admin:1234@mongodbtutorial.hnsbnpp.mongodb.net/BlogService?retryWrites=true&w=majority&appName=MongodbTutorial';

const server = async () => {
    try{
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            //useCreateIndex : true,
            //useFindAndModify : false
        });
        //await mongoose.set("debug", true);
        //가짜 데이터 생성
        //generateFakeData(100, 10, 300);
        console.log("MongoDB Connected");
 
        app.use(express.json());
        app.use("/user", userRouter);
        app.use("/blog", blogRouter);
        //blogRoute.js안에도 설정할 수 있다.
        //app.use("/blog/:blogId/comment", commentRouter);

        app.listen(3000, async () => {
            console.log("Server Listening on Port 3000");
            // for(let i=0; i<20; i++){
            //     await generateFakeData(10, 1, 10);
            // }
            //console.time("insert time : ")
            //await generateFakeData(10, 2, 10);
            //console.timeEnd("insert time : ")
        });
    }catch (err){
        console.log({err});
    }
}

server();
//https://github.com/hoffnung8493/mongodb_tutorial