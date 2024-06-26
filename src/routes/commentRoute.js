const {Router} = require("express");
const commentRouter = Router({mergeParams : true});
const {Comment, Blog, User} =  require("../models"); // models 폴더의 index.js파일 불러옴
//const {Comment} = require("../models/Comment");
//const {Blog} = require("../models/Blog");
//onst {User} = require("../models/User");
const {isValidObjectId, startSession} = require("mongoose");
/*
    /user
    /blog
    /blog/:blogId/comment
*/
commentRouter.post("/", async (req, res) =>{
    const session = await startSession();
    let comment;
    try{
        //transaction은 sesstion으로 처리해야 됨.
        await session.withTransaction(async (res, req) => {

        
        const {blogId} = req.params;
        const {content, userId} = req.body;
        if(!isValidObjectId(blogId)) return res.status(400).send({err:"blogId is invalid"});
        if(!isValidObjectId(userId)) return res.status(400).send({err:"userId is invalid"});
        if(typeof content !== 'string') return res.status(400).send({err : "content is required"})

        //const blog = await Blog.findByIdAndUpdate(blogId);
        //const user = await User.findByIdAndUpdate(userId);
        
        const [blog, user] = await Promise.all([
            Blog.findById(blogId, {}, {session}),
            User.findById(userId, {}, {session})
        ])  

        if(!blog || !user) return res.status(400).send({err : "blog  or does not exist"});
        if(!blog.islive) return res.status(400).send({err : "blog is not available"});

        comment = new Comment({ 
            content, 
            user, 
            userFullName : `${user.name.first}  ${user.name.last}`, 
            blog : blogId
        });
        //Transacton 중단 할 떄,
        //await session.abortTransaction();
        
        /*
        await Promise.all([
            comment.save(),
            Blog.updateOne({_id : blogId}, {$push : {comments : comment}})
        ]);
        */
    //    blog.commentsCount++;
    //    blog.comments.push(comment); //무한루프 발생, blog comments에 push 하면 comment 안에 blog comments에 push 이렇게 무한루프, 그래서 blog:blogId 지정해주면 해결됨
    //    if(blog.commentsCount > 3) blog.comments.shift();

    //    await Promise.all([
    //         comment.save(session), 
    //         blog.save() //blog 안에 comment session이 있음
    //        //Blog.updateOne({_id : blogId}, {$inc: {commentsCount : 1} })
    //     ]); 

    })
        await Promise.all([
            comment.save(),                                                                                 //$slice : -3 -> 최근 3개 뺴고 나머지 빼라
            Blog.updateOne(
                {_id : blogId}, 
                {$inc:{commentsCount : 1}, 
                $push:{comments:{$each : [comment], $slice : -3}}}
            ),

        ])

        return res.send({comment});
    }catch(err){       
        return res.status(400).send({err: err.message});
    } finally {
        //await session.endSession()
    }
});

commentRouter.get("/", async (req, res) =>{
    let { page=0 } = req.query;
    page = parseInt(page);

    const {blogId} = req.params;
        const {content, userId} = req.body;
        if(!isValidObjectId(blogId)) return res.status(400).send({err:"blogId is invalid"});

        console.log({page});

        const comments = await Comment.find({blog : blogId}).sort({createAt : 1}).skip(page * 3).limit(3);
        return res.send(comments);
});

commentRouter.patch("/:commentId", async(req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;
    if(typeof content !== 'string') return res.status(400).send({err : "content is required"});

    const [comment] = await Promise.all([
        Comment.findOneAndUpdate(
                                {_id : commentId}, 
                                {content},//{content : content}, 
                                {new : true}
        ),
        Blog.updateOne(
            {'comments._id' : commentId}, 
            {"comments.$.content" : content}    //Blog 내 comments가 배열(Blog.js)
        )
    ]);
    
    return res.send({comment});
});

commentRouter.delete("/:commentId", async(req, res) =>{
    const {commentId} = req.params;
    const comment = await Comment.findOneAndDelete({_id : commentId});
    await Blog.updateOne({"comments._id" : commentId}, {$pull : {comments : {_id : commentId}}})    //{comment : {content:"hello", state : ture}} 둘 중 하나만 만족해도 삭제 됨
                                                                                                    //{comment : {$eleMatch:{content:"hello", state : ture} }} 둘다 만족해야 삭제
    return res.send({comment});
});
module.exports = {commentRouter};