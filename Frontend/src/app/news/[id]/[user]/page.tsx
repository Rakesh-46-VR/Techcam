"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThumbsUp, MessageSquare, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import "./NewsDetail.css";
import NewComment from "../../Components_News/NewComment";
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

interface Comment {
  _id: string;
  username: string;
  comment: string;
  createdAtF: string;
}

interface LikedBy{
  user_Id:string[];
}

interface NewsArticle {
  username: string;
  post: {
    _id: number;
    imageUrl: string;
    title: string;
    likes: number;
    likedBy:LikedBy;
    comments: Comment[];
    description: string;
    createdAtF: string;
  };
}

function NewsDetail({
  params,
}: {
  params: { id: string; user: string };
}) {
  const id = params.id;
  const user_id = params.user;
  const { user } = useUser();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liked, setIsLiked] = useState(Boolean);
  const [likes, setLikes] = useState<number | null>(null);
  const [colorfill, setColorFill] = useState('transparent');
  const [likedBy , setLikedBy] = useState<LikedBy |null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const body = {
        user_id: user_id,
        post_id: id,
      };
      const response = await axios.post(
        "http://localhost:3000/fetchnews",
        body
      );
      const data = await response.data[0];
      console.log(data);

      if (!data) {
        throw new Error("No article found");
      }

      setArticle(data);
      setLikes(data.post.likes);
      setLikedBy(data.post.likedBy)
      setLikes(data.post.likedBy.user_Id.length)
      if (data.post.likedBy.user_Id.includes(user?.sub)){
        setIsLiked(true)
        setColorFill('blue')
      }else{
          setIsLiked(false)
      }
    } catch (error) {
      console.error("Error fetching news detail:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikes = () => {
    const data = {
      likedBy : user?.sub,
      postId : id,
      userId : user_id,
    }
    if (liked){
      //decrement and remove from list
      setIsLiked(false)
      setColorFill('transparent')
      updateLikes(data, false)

    }else{
      setIsLiked(true)
      setColorFill('blue')
      updateLikes(data, true)
    }
  };

  const updateLikes = async(data:object , remove:boolean) =>{
      try{
        const response = await axios.post("http://localhost:3000/updatelikes", {data , remove:remove});
        setLikes(response.data.likes)
        setLikedBy(response.data.likedBy)
        console.log(response.data)
      }catch(error){
        console.log(error);
      }
  }

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);


  const handleCommentSubmit = async (text: string) => {
    try {
      const body = {
        post_user_id: user_id,
        post_id: id,
        username: user?.nickname,
        commenterId: user?.sub,
        comment: text,
      };
      await axios.post("http://localhost:3000/comment", body);
      await fetchData(); // Refetch the article data to update comments
    } catch (error) {
      console.error("Error while commenting: ", error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div style={{ marginTop: "60px" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ marginTop: "60px" }}>Error: {error}</div>;
  }

  if (!article) {
    return <div style={{ marginTop: "60px" }}>Article not found</div>;
  }

  return (
    <motion.div
      className="news-detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="news-detail-title">{article.post.title}</h1>
      <img
        src={article.post.imageUrl}
        alt={article.post.title}
        className="news-detail-image"
      />
      <p className="news-detail-username">@{article.username}</p>
      <div className="news-detail-stats">
        <span className="news-detail-likes">
          <ThumbsUp strokeWidth={2} size={26} fill={colorfill} color="white" onClick={handleLikes} /> {likes}
        </span>
        <span className="news-detail-comments">
          <MessageSquare size={24} /> {article.post.comments.length}
        </span>
      </div>
      <p className="news-detail-content">{article.post.description}</p>
      <p className="news-detail-username">
        Posted On : {article.post.createdAtF}
      </p>

      <div className="news-detail-comments-container">
        <NewComment
          currentUser={user?.nickname}
          handleSubmit={handleCommentSubmit}
          placeholder="Write your comment here..."
          buttonText="Send"
        />

        <h2>Comments</h2>
        {article.post.comments.map((comment) => (
          <div className="comment" key={comment._id}>
            <div className="comment-avatar">
              <UserRound size={32} strokeWidth={1.5} />
              <p className="comment-username">@{comment.username}</p>
            </div>
            <div className="comment-date">
              <p>{comment.createdAtF}</p>
            </div>
            <div className="comment-content">
              <p className="comment-text">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default withPageAuthRequired(NewsDetail);
