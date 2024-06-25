const {Schema, model, Types} = require("mongoose");
const { CommentSchema } = require("./Comment");

const BlogSchema = new Schema(
    {
        title : { type: String, required :true},
        content : {type: String, required : true},
        islive : {type : Boolean, required : true, default : false},
        // user : {type : Types.ObjectId, required : true, ref : 'user'}
        user : {
            _id : {type : Types.ObjectId, required : true, ref : 'user'},
            username :{type:String, required: true},
            name : {
                first : {type : String, required : true},
                last : {type : String, required : true},
            },    
        },
        comments: [CommentSchema],
        commentsCount : {type : Number, default : 0, required : true}
    },
    {timestamps :true}
);

CommentSchema.index({blog : 1, createAt : -1});

BlogSchema.index({'user._id' : 1, updatedAt : 1});
//BlogSchema.index({title:"text"})    //collection당 하나만 만들 수 있다. 아틀라스에서 필드없이 {$text:{$search : 'et'}} 치면 et 포함된 블로그들이 나옴
BlogSchema.index({title:"text", content:"text"});

//가상의 키 생성
/*
BlogSchema.virtual("comments", {
    ref: "comment",
    localField : "_id", 
    foreignField : "blog"
});

BlogSchema.set("toObject", {virtuals : true});
BlogSchema.set("toJSON", {virtuals : true})
*/
const Blog = model("blog", BlogSchema);
module.exports = { Blog };