import { useRef, useState } from "react";
import Avatar from '@mui/material/Avatar';
import { IoMdImages } from "react-icons/io";

import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
gsap.registerPlugin("x");


import './post.css';

export default ({ user, setPostList, notifyError }) => {
    const wrapper = useRef();
    const [postContent, setPostContent] = useState('');
    const [postMedia, setPostMedia] = useState(undefined);
    const [imagePreview, setImagePreview] = useState('');
    const [postErrors, setPostErrors] = useState([]);
    const postDefault = {
        id: new Date().toISOString(),
        author: user,
        content: '',
        createdAt: new Date().toISOString(),
        image: imagePreview || undefined,
        comments: [],
        likes: [],
        shares: []
    };

    const updatePostContent = (e) => {
        console.log(e.target.value);
        setPostContent(e.target.value);
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

    const createPost = () => {
        if (postContent.trim().length <= 0) {
            gsap.to('.wrapper', {
                duration: 0.05,
                x: 10,
                repeat: 6,
                yoyo: true,
                onComplete: () => {
                    gsap.set('.wrapper', { x: 0 });
                }
            });
            notifyError('Scrivi qualcosa, coglione')
            return;
        }
        setPostList(oldPostList => [...oldPostList, { ...postDefault, content: postContent }]);
        setPostContent('');
    }

    return (
        <div className="wrapper" ref={wrapper}>

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
                <button onClick={createPost}>Publish</button>
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
