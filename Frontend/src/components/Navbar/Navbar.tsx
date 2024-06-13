// Navbar.tsx
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, error, isLoading } = useUser();

  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const registerUser = async () => {
      try {
        if (user && !isRegistered) { 
          setIsRegistered(true);

          const response = await axios.post('http://localhost:3000/register', {
            email: user.email,
            username: user.nickname, 
            id: user.sub, 
          });

          console.log('Backend response:', response.data);
        }
      } catch (error) {
        console.error('Error calling backend:', error);
      }
    };

    registerUser();
  }, [user, isRegistered]);
  
  if (isLoading) return <div></div>;
  if (error) return <div>{error.message}</div>;
  return (
    <nav className="navbar">
      
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i}></div>
          ))}
      </div>
      <div className="logo">
        <a href="/">TechCam</a>
      </div>
      <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <li><a href="/">Home</a></li>
        <li><a href="/news">Tech-news & Reviews</a></li>
        {/* <li><a href="/forums">Discussion Forum</a></li> */}
        <li><a href="/about">About us</a></li>
        <li><a href="/contact">Contact us</a></li>
        {user ? (
          <>
          <li><a href="/api/auth/logout">Logout</a></li>
          <li><a href="/profile">{user.nickname}</a></li>
          </>
          ) : (
          <li><a href="/api/auth/login">Login/Signup</a></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
