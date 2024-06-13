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
            {/* <p className="bio">
              Look again at that dot. That's here. That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives
            </p> */}
          </div>
          
          <div className="stats">
            {/* <div className="stat">
              <strong>345</strong>
              <span>Posts</span>
            </div> */}
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