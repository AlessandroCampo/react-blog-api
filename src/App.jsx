import { useEffect, useState } from "react";
import CreatePost from "./components/PostComponents/CreatePost"
import Post from "./components/PostComponents/Post";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';



const app = () => {

  const apiUrl = import.meta.env.VITE_API_URL;


  const [postList, setPostList] = useState([]);
  const [user, setUser] = useState(undefined);

  let authToken = '';
  const fetchToken = async () => {
    try {
      const userData = {
        username: 'Aleks7',
        password: 'Pass123!'
      }
      const { data } = await axios.post(`${apiUrl}users/login`, userData);
      if (data) {
        console.log(data);
        setUser(data.user);
        authToken = data.token;
        return data.token
      }
    } catch (err) {
      console.error(err);
    }
  }

  const loginThenFetchPosts = async () => {
    const token = await fetchToken();
    await fetchPosts(token);
  }



  const fetchPosts = async (token) => {
    if (!token) return
    try {

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const { data } = await axios.get(`${apiUrl}posts`, { headers });

      if (data) {
        setPostList([...data.allPosts]);

      }
    } catch (err) {
      console.error(err);
    }
  }

  //get Token
  useEffect(() => {
    loginThenFetchPosts();
  }, [])


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