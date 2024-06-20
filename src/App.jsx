import { useEffect, useRef, useState } from "react";
import CreatePost from "./components/PostComponents/CreatePost"
import Post from "./components/PostComponents/Post";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';



const app = () => {

  const apiUrl = import.meta.env.VITE_API_URL;


  const [postList, setPostList] = useState([]);
  const [user, setUser] = useState(undefined);
  const [lastPage, setLastPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);

  const postContainer = useRef(null);


  let authToken = '';
  const fetchToken = async () => {
    try {
      const userData = {
        username: 'Aleks7',
        password: 'Pass123!'
      }
      const { data } = await axios.post(`${apiUrl}users/login`, userData);
      if (data) {

        setUser(data.user);
        authToken = data.token;
        localStorage.setItem('authTokenReact', data.token)
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



  const fetchPosts = async (token, page = 1) => {
    console.log('calls counter')
    if (!token || page > totalPages) return

    try {

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const { data } = await axios.get(`${apiUrl}posts?page=${page}`, { headers });
      (data)
      if (data) {
        setPostList(oldList => [...data.allPosts]);
        setTotalPages(data.totalPages)
        console.log(data)
      }
    } catch (err) {
      console.error(err);
    }
  }

  //get Token
  useEffect(() => {
    loginThenFetchPosts();
  }, [])



  useEffect(() => {
    const handleScroll = async () => {
      if (postContainer.current) {
        const scrollTop = document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const containerHeight = postContainer.current.offsetHeight;
        const containerTop = postContainer.current.offsetTop;
        const bottomOfViewport = scrollTop + windowHeight;
        const triggerPoint = containerTop + containerHeight * 0.9;

        if (bottomOfViewport >= triggerPoint) {
          console.log('triggered')
          const token = localStorage.getItem('authTokenReact');
          setLastPage(prevPage => {
            const nextPage = prevPage + 1;
            fetchPosts(token, nextPage);
            return nextPage;
          })
          return
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [postList]);

  const notifyError = (errorText) => {
    toast.error(errorText)
  }

  const notifySuccess = (text) => {
    toast.success(text)
  }

  return (
    <>
      <ToastContainer
        theme="dark"
        hideProgressBar
      />

      <div className="home-container overflow-auto">
        <CreatePost
          user={user}
          setPostList={setPostList}
          notifyError={notifyError}
          notifySuccess={notifySuccess}
          onPostCreate={(token) => { fetchPosts(token) }}
          token={authToken}
        />
        <div className="posts-container" ref={postContainer}>
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