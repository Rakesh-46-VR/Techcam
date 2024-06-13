"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from "axios";
import "./IndividualNews.css";

interface NewsArticle {
  _id: string;
  postId: string;
  userId: string;
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  username: string;
  comments: object; // Make comments optional for response structure
}

const IndividualNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const {user} = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = {
          userId : user?.sub
        }
        const response = await axios.post("http://localhost:3000/fetchnews/specific" , body);
        const data = await response.data;
        setArticles(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="news-page-container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Posts
      </motion.h1>
      <div className="news-grid">
        {articles.map((article) => (
          <Link
            href={`/news/${article.postId}/${article.userId}`} // Concatenate post ID and username
            key={article.postId}
          >
            <motion.div
              className="news-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                className="news-image"
              />
              <div className="news-card-content">
                <h2 className="news-title">{article.title}</h2>
                {/* <p className="news-username">@{article.username}</p> */}
                <div className="news-stats">
                  <span className="news-likes">
                    <ThumbsUp size={16} /> {article.likes}
                  </span>
                  <span className="news-comments">
                    <MessageSquare size={16} /> {article.comments.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IndividualNewsPage;
