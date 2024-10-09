/* eslint-disable no-undef */
import express from 'express';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import cors from 'cors'
import mongoose from 'mongoose';
import UserChats from './models/userChat.js';
import Chat from './models/chats.js'
import chats from './models/chats.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

dotenv.config();


const port=process.env.PORT||3000;
const app=express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,

}))
app.use(express.json())
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});
app.get('/api/upload',(req,res) => {
    const  result = imagekit.getAuthenticationParameters();
    res.send(result);
})
// app.get("/api/test",ClerkExpressRequireAuth(),(req,res)=>{
//     const userId=req.auth.userId;
//     console.log(userId)
//     res.send("success");
// })
app.post('/api/chats',
      ClerkExpressRequireAuth(),async(req,res) => {
        const userId=req.auth.userId;
   const {text}=req.body;
    try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      res.status(201).send(newChat._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
})

app.get("/api/userchats",ClerkExpressRequireAuth(),async(req,res)=>{
    const userId=req.auth.userId;
    try {
        const userChats= await UserChats.find({userId});
          res.status(200).send(userChats[0].chats);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("error fetching usechats");
        
    }
})
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(401).send('Unauthenticated!')
})


app.listen(port, () =>{
    connect();
    console.log("server is running");
})