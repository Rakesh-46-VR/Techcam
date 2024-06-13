"use client"
import React, { useState } from 'react';
import axios from 'axios';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import {Pencil} from "lucide-react"
import './Post.css';
import {useUser} from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation';
import Loader from '../Loader/Loader';

const PostIcon = () => {
  
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    description: ''
  });

  const [loading, setLoading] = useState(false); // State to handle loader

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({
        ...formData,
        [name]: files[0] // Assuming you only upload one image file
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    const postData = new FormData();
    postData.append('username', user.nickname)
    postData.append('userId', user.sub)
    postData.append('title', formData.title);
    postData.append('image', formData.image);
    postData.append('description', formData.description);

    try {
      const response = await axios.post('http://localhost:3000/uploadnews', postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({
        title: '',
        image: null,
        description: ''
      });
      setIsOpen(false);
      console.log('Post successful:', response.data);
    } catch (error) {
      console.error('Error posting:', error);
    } finally{
      setLoading(false);
      window.location.reload()
    }
  };

  return (
    <div className="post-icon-container">
      {loading && <Loader />} 
      <div className="post-icon-inner" onClick={handleToggle}>
        <Pencil color='white'/>
      </div>
      {isOpen && (
        <div className="post-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
            <br />
            <br />
            <label htmlFor="image">Image:</label>
            <input type="file" id="image" name="image" onChange={handleChange} />
            <br />
            <br />
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            <br />
            <br />
            <input type="submit" value="Post" />
          </form>
        </div>
      )}
    </div>
  );
};

export default PostIcon;
