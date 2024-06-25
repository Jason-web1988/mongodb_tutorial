console.log("client code running.");
const axios = require("axios"); //restAPI 에서 자주 사용하는 모듈

const URI = "http://localhost:3000";

//비효율적인 방법 :  
// - blogsLimit : 20일 때  9.674s,  4.016s,  5.971s,  5.066s,  5.768s,  5.200s,  5.019s,  5.049s,  4.950s
//                50일 때 23.236s,  6.304s,  12.049s, 11.915s, 11.104s  11.801s  11.341s  11.639s 10.312s
//효율적인 방법 (populate 사용하는 방법)
// - blogsLimit : 20일 때  886.128ms, 804.618ms, 735.894ms, 782.001ms, 710.418ms, 766.865ms, 703.529ms, 768.118ms, 1.151s
//                50일 때  1.430s, 1.190s, 1.850s, 2.943s, 2.212s, 1.596s, 1.578s, 1.386s, 1.904s
//                200일 떄 4.912s, 5.243s, 4.672s, 4.808s, 4.853s, 5.118s, 5.402s, 5.513s, 5.080s
//nesting 사용하는 방법
// - blogsLimit : 20일 때  
//                50일 때  
//                200일 떄 472.886ms 20.089ms 481.402ms 456.472ms 352.619ms 378.371ms 378.467ms 375.499ms 373.05ms
const test = async () => {
    console.time("loading time : ");
    /*
    let {
        data : { blogs }
    } =*/ await axios.get(`${URI}/blog`);
 //   console.dir(blogs[2], {depth: 10});
 /*   
    blogs = await Promise.all(       
        blogs.map(async (blog) => {   //배열을 받고 배열을 리턴해줌
            try{
                const [res1, res2] = await Promise.all([
                                    axios.get(`${URI}/user/${blog.user}`), 
                                    axios.get(`${URI}/blog/${blog._id}/comment`)
                                ]); 
                blog.user = res1.data.user;
               // console.log(res2.data);
                blog.comments = await Promise.all(res2.data.map(async (comment) => {                      
                    const {data : {user}} = await axios.get(`${URI}/user/${comment.user}`);                    
                    comment.user = user;
                    return comment;
                }));
                
            }catch (err){
                console.log({err : err.message});
            }
            return blog;
            }
        )
    );
    //console.dir(blogs[0], {depth:10});
*/ 
    console.timeEnd("loading time : ");
};

test();

const testGroup = async () => {
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();     
};
testGroup();  