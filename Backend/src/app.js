require('dotenv').config();
const cors = require('cors');
const express = require('express');
const {upload} = require('./middlewares/multer.middleware.js')
const { uploadOnCloudinary } = require('./utils/cloudinary.js');
const { ObjectId } = require('mongodb');
const app = express();

const db = require('./database/mongodb.js')

//Schemas :
const User = require('./models/UserSchema.js')
const {Data, postSchema} = require('./models/DataSchema.js')

//Port
const port = 3000;

//Req body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware to log request method and URL
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//Login
app.post("/login" , async(req, res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;
        const existsuser = await User.findOne({username:username})
        if(existsuser && existsuser.password === password){
            res.status(200).send(true)
        }else{
            res.status(200).send("Invalid Credentials");   
        }
    } catch (error) {
        console.log(error);
    }
})

//Register
app.post("/register" , async(req, res)=>{
    try {
        const data = {
            username : req.body.username,
            userId : req.body.id,
            email : req.body.email
        }
        const existsuser = await User.findOne({userId:data.userId})
        if(!existsuser){
            const NewUser = await User.create(data);
            res.status(200).send(true)
        }else{
            res.status(200).send(false)
        }
    } catch (error) {
        console.log(error);
    }
})

app.post("/unique" , async (req, res)=>{
    try {
        const username = req.body.username
        const result = await User.findOne({username})
        if (result) {
            res.status(200).send(false)
        }else{
            res.status(200).send(true)
        }
    } catch (error) {
        console.log(error)
    }
})

app.get("/fetchnews/all" , async(req , res)=>{
    try {
        const pipeline = [
            { $unwind: '$post' },

            {
                $project: {
                    postId: '$post._id',
                    title: '$post.title',
                    imageUrl: '$post.imageUrl',
                    description: '$post.description',
                    likes: '$post.likes',
                    username: '$username',
                    userId: {
                        $arrayElemAt: [
                            { $split: ['$userId', '|'] }, 
                            1 
                        ]
                    },
                    comments: '$post.comments'
                }            
            }
        ]

        const posts = await Data.aggregate(pipeline)
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
    }
})

app.post("/fetchnews/specific", async (req, res) => {
    try {
        const user_id = req.body.userId; 
        
        const pipeline = [
            {
                $match: {
                    userId: user_id
                }
            },
            { $unwind: '$post' },
            {
                $project: {
                    postId: '$post._id',
                    title: '$post.title',
                    imageUrl: '$post.imageUrl',
                    description: '$post.description',
                    likes: '$post.likes',
                    username: '$username',
                    userId: {
                        $arrayElemAt: [
                            { $split: ['$userId', '|'] }, 
                            1 
                        ]
                    },
                    comments: '$post.comments'
                }            
            }
        ];

        const posts = await Data.aggregate(pipeline);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching specific news:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Fetch individual news from a the database
app.post("/fetchnews" , async(req , res)=>{
    try {
        const user_id = req.body.user_id;
        const post_id = req.body.post_id;
        const pipeline = [
            {$match : {userId : "auth0|" + user_id}},
            {$unwind : '$post'},
            {$match : {"post._id" : new ObjectId(post_id)}},
            { 
                $addFields: { 
                    "post.createdAtF": { 
                        $dateToString: { 
                            format: "%d %b %Y", // Specify the desired format
                            date: "$post.createdAt" // Assuming `createdAt` is the field name
                        } 
                    } 
                } 
            },
            {
                $addFields: {
                    "post.comments": {
                        $map: {
                            input: { $ifNull: ["$post.comments", []] }, // Handle missing comments array
                            as: "comment",
                            in: {
                                $mergeObjects: [
                                    "$$comment",
                                    {
                                        createdAtF: {
                                            $dateToString: {
                                                format: "%d %b %Y", // Specify the desired format
                                                date: "$$comment.createdAt" // Format comment createdAt
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        ]
        const getpost = await Data.aggregate(pipeline)
        res.status(200).send(getpost);
    } catch (error) {
        console.log(error);
    }
})

//Uploading a news by user's
app.post("/uploadnews", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'File not uploaded' });
        }
        console.log(req.file.path);
        const imageUpload = await uploadOnCloudinary(req.file.path);

        if (!imageUpload) {
            return res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
        }
        else{
            console.log('File uploaded to Cloudinary:');
            const uploadedUrl = imageUpload.url;
            const UserName = req.body.username;
            const userId = req.body.userId;
            const existsuser = await Data.findOne({username:UserName})
            if (!existsuser){
                const result = await Data.create({
                    username : UserName,
                    userId: userId,
                    post : {
                        title:req.body.title,
                        imageUrl:uploadedUrl,
                        description:req.body.description,
                    }
                })
            }else{
                const post = {
                    title:req.body.title,
                    imageUrl:uploadedUrl,
                    description:req.body.description,
                }
                existsuser.post.push(post);
                const result = await existsuser.save();
            }
        }
        return res.status(200).json({ message: 'File uploaded successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post("/comment" , async(req , res)=>{
    try {

        const userId = req.body.post_user_id;
        const postId = req.body.post_id;

        const commentUsername = req.body.username;
        const commentUserId = req.body.commenterId;
        const commentText = req.body.comment;

        const user = await Data.findOne({ userId: "auth0|" +userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(postId);
        const post = user.post.id(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            username: commentUsername,
            cuserId: commentUserId,
            comment: commentText,
        };

        post.comments.push(newComment);
        const result = await user.save();
        res.status(200).json(post);

    } catch (error) {
        console.log(error);
    }
})

app.post("/updatelikes", async (req, res) => {
    try {
        const likedBy = req.body.data.likedBy;
        const user_id = req.body.data.userId;
        const post_id = req.body.data.postId;
        const remove = req.body.remove;
        const data = await Data.findOne({ userId: "auth0|"+user_id, 'post._id': post_id });
        
        if (!data) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const post = data.post.id(post_id);
        if (remove){
            post.likedBy.user_Id.push(likedBy)
            post.likes = post.likedBy.user_Id.length
        }else{
            post.likedBy.user_Id.pop(likedBy)
            post.likes = post.likedBy.user_Id.length
        }
        data.post = post

        await data.save();
        const response = { message: 'Likes updated successfully', likedBy:post.likedBy, likes: post.likes }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating likes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Route to handle all other requests
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});