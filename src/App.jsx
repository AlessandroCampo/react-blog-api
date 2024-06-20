import { useState } from "react";
import CreatePost from "./components/PostComponents/CreatePost"
import Post from "./components/PostComponents/Post";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const app = () => {
  const [postList, setPostList] = useState([]);
  const user = {
    username: 'Aleks'
  }

  const notifyError = (errorText) => {
    toast.error(errorText)
  }

  return (
    <>
      <ToastContainer
        theme="dark"
        hideProgressBar
      />

      <div className="home-container">
        <CreatePost
          user={user}
          setPostList={setPostList}
          notifyError={notifyError}
        />
        <div className="posts-container">
          {
            postList.map((p, i) => {
              return <Post
                user={user}
                key={p.id || `post-${i}`}
                post={p}
                setPostList={setPostList}

              />
            })
          }
        </div>

      </div>

    </>
  )
}

export default app;