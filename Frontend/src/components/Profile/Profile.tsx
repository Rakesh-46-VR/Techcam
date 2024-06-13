'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import IndividualNewsPage from "./IndividualNews"

import PostIcon from '../Posts/Posts';
import './ProfileDesign.css'

const Profile= ()=> {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <>
      <div className='profile-container'>

          <div className="profile-picture">
            <img src={user.picture} alt="Profile Picture" />
          </div>

          <div>
            <h1 className="profile-name">{user.nickname} ❤</h1>
            <p className="profile-username">@{user.email}</p>
          </div>
          
          <div className="stats">
          </div>

          <div className="photos">
            <IndividualNewsPage/>
          </div>
          
          <div className='post-icon'>
            <PostIcon />
          </div>
      </div>
      </>
    )
  );
}

export default  withPageAuthRequired(Profile)