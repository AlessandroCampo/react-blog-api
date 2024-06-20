import { useRef, useState } from "react";
import Avatar from '@mui/material/Avatar';
import { IoMdImages } from "react-icons/io";


import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
gsap.registerPlugin("x");
import axios from 'axios';


import './post.css';
import { BeatLoader, CircleLoader, PropagateLoader } from "react-spinners";

export default ({ user, setPostList, notifyError, onPostCreate, notifySuccess }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const wrapper = useRef();
    const [postContent, setPostContent] = useState('');
    const [creatingPost, setCreatingPost] = useState(false);
    const [postMedia, setPostMedia] = useState(undefined);
    const [imagePreview, setImagePreview] = useState('');
    const [postErrors, setPostErrors] = useState([]);
    const postDefault = {
        content: '',
        image: imagePreview || undefined,
    };

    const updatePostContent = (e) => {
        console.log(e.target.value);
        setPostContent(e.target.value);
    }


    const errorAnimation = () => {
        return new Promise((resolve) => {
            gsap.to('#createPostWrapper', {
                duration: 0.05,
                x: 10,
                repeat: 6,
                yoyo: true,
                onComplete: () => {
                    gsap.set('#createPostWrapper', { x: 0 });
                    resolve();  // Resolve the promise when the animation completes
                }
            });
            notifyError('Scrivi qualcosa, coglione');
        });
    }


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setPostMedia(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const createPost = async () => {
        // Frontend validation
        if (postContent.trim().length <= 0) {
            await errorAnimation();
            return;
        }

        setCreatingPost(true);

        const token = localStorage.getItem('authTokenReact');
        if (!token) {
            console.error('problemi!');
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        };

        const formData = new FormData();
        formData.append('content', postContent);
        if (postMedia) {
            formData.append('image', postMedia);
        }

        try {
            const response = await axios.post(`${apiUrl}posts`, formData, { headers });
            if (response.data) {
                console.log(response.data);
            }
        } catch (err) {
            console.error(err);
            notifyError(err.message);
            return
        }
        onPostCreate(token);
        setPostContent('');
        setCreatingPost(false);
        notifySuccess('Your post has been succesfully created!')
    }


    return (
        <div className="wrapper" ref={wrapper} id="createPostWrapper">

            <div className="upper">
                <Avatar
                    sx={{ bgcolor: '#DAA520', color: 'gray', width: 48, height: 48 }}
                    alt={user?.username}
                    src="/static/images/avatar/1.jpg"

                />
                <textarea
                    value={postContent}
                    placeholder="What's on your mind?"
                    className="h-[100px]"
                    onChange={(e) => { updatePostContent(e) }}
                >
                </textarea>
            </div>
            {
                postMedia &&
                <figure
                    className="w-full h-[150px]"
                >
                    <img
                        src={imagePreview}
                        alt="post_preview"
                        className="preview"
                    />
                </figure>

            }
            <div className="lower">
                <label
                    htmlFor="postPic"

                >
                    <IoMdImages
                        className="icon-common"
                    />
                </label>

                <input
                    type="file"
                    id="postPic"
                    onChange={(e) => { handleFileUpload(e) }}
                    className="hidden"
                    accept=".jpg, .png, .jpeg"
                />



                <button onClick={createPost}>
                    {

                        creatingPost ? <BeatLoader color="black" size={10} margin={0} /> : 'Publish'
                    }

                </button>


            </div>
            {
                postErrors.length > 0 && <p className="px-6 errors-container text-red-600 font-semibold flex flex-col gap-2">
                    {
                        postErrors.map(err => {
                            return <div className="error">
                                {err}
                            </div>
                        })
                    }

                </p>
            }

        </div>
    )
};
