import React, { useEffect, useState } from "react";

/* 
    Requirements - 
    1. Fetch data from api and display title, price, image.
    2. Do pagination with next and prev button and current page.
    3. Add an option to set page size (Ex - 5, 10, 20 )


    Components - 
       Posts - 
       postsList (useState)
       async function getPosts (Append and add posts data)
       useEffect (To run getPosts function on 1st render)
       


*/

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