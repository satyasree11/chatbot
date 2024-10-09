import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import './homePage.css';
import { useState } from 'react';

const HomePage = () => {
  const[typingStatus,setTypingStatus]=useState("human1");
  // const test = async()=>{
  //   await fetch("http://localhost:3000/api/test",{
  //   credentials:"include"})
  // }
  return (
    <div className="homePage">
      <img src='/orbital.png' alt='' className='orbital'/>
      <div className="left">
        <h1>CHATBOT</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat sint
          dolorem doloribus, architecto dolor.
        </h3>
        <Link to="/dashboard">Get Started</Link>
        
      </div>
      <div className="right">
      <div className="imgContainer">
        <div className="bgContainer">
          <div className="bg"></div>
        </div>
        <img src='/bot.png' alt='' className='bot'/>
        <div className="chat">
          <img src={typingStatus=='human1'?"/human1.jpeg":typingStatus =="human2"?"/human2.jpeg":"bot.png"} alt=""/>
            <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'human1:We produce food for Mice',
       2000, ()=>{
          setTypingStatus("bot");
        },
        
        // wait 1s before replacing "Mice" with "Hamsters"
        'bot:We produce food for Hamsters',
        2000,
        ()=>{
          setTypingStatus("human2");
        },
        
        'human2:We produce food for Guinea Pigs',
        2000,
        ()=>{
          setTypingStatus("bot");
        },
        'bot:We produce food for Chinchillas',
        2000,()=>{
          setTypingStatus("human1 ");
        },
      ]}
      wrapper="span"
      cursor={true}
      omitDeletionAnimation={true}
      
      repeat={Infinity}
    />
        </div>
      </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>!</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;