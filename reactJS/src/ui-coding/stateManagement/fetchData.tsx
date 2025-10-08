import React, { useEffect, useState } from "react";

export default function FetchData(){
    const [postsData, setPostsData] = useState([]);
    
    async function fetchPosts(){
        let postData = await fetch('https://dummyjson.com/posts');
        postData = await postData.json();

        setPostsData(postData?.posts);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

   return (
        <div>
            {
                postsData.map((currentPost) => {
                    return (
                        <div key={currentPost?.id}
                            style={{
                                margin: 20,
                                
                            }}
                        >
                            <p>{currentPost?.title}</p>
                            <p>{currentPost?.body}</p>
                        </div>
                    )    
                })
            }
        </div>
   );
}