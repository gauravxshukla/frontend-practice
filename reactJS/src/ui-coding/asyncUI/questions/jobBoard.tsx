
// Write the business logic first and UI later.
/*
 APIs
  Job IDs -  https://hacker-news.firebaseio.com/v0/jobstories.json
  Job Details - https://hacker-news.firebaseio.com/v0/item/{id}.json
 */

import React from "react";
import { useEffect, useState } from "react";

export default function JobBoard() {
    const [jobPostings, setJobPostings] = useState([]);

    async function fetchJobPosting() {
        let newJobPostings = [];
        let jobIdList = await fetch('https://hacker-news.firebaseio.com/v0/jobstories.json');
        jobIdList = await jobIdList.json();

        // fetch all job data in parallel
        const jobData = await Promise.all(
            jobIdList.map(async (currentJobId) => {
            const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${currentJobId}.json`);
            return res.json();
            })
        );
        
        setJobPostings((prev) => [...prev, ...jobData]);
    }

    useEffect(() => {
        fetchJobPosting();
    }, []);

    return (
        <div style={{
            margin: 0,
            padding: 8,
            width: '100%',
            backgroundColor: '#f6f6ef',
        }}>
            {/* Heading */}
            <h2 style={{
                color: 'black'
            }}>Hacker News Job Board</h2>

            {/* Job Posting List */}
            {
                jobPostings.length === 0 &&
                <p>Loading...</p>
            }
            {
                jobPostings.map((currentJob) => {
                    const date = new Date(currentJob?.time * 1000); // Multiply by 1000 to convert seconds to milliseconds
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
                    const year = date.getFullYear();
                    const hours = String(date.getHours()).padStart(2, "0");
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                  
                    const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes}`;
                    return (
                        <div key={currentJob?.id} style={{
                            backgroundColor: "white",
                            marginBottom: 12,
                            padding: 6,
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "grey",
                            display: "flex",
                            flexDirection: 'column'
                        }}>
                            {/* Job Post Heading */}
                            <div
                                style={{
                                }}
                            >
                                <h3 
                                style={{
                                    color: 'black',
                                    padding: 0,
                                    margin: 0
                                    }}
                                >
                                {currentJob?.title}
                                </h3>
                            </div>

                            {/* Job Post Details */}
                            <div style={{
                                display: "flex",
                                flexDirection: 'row',
                                color: 'black',
                                gap: 5
                            }}>
                                <p>By {currentJob?.by}</p>
                                <p>{formattedDate}</p>
                            </div>
                            
                        </div>
                    )
                })
            }

            {/* Load more jobs */}
            <button 
                style={{backgroundColor: 'orange'}}
                onClick={() => fetchJobPosting()}
            >
                Load more jobs
            </button>

        </div>
    );
}