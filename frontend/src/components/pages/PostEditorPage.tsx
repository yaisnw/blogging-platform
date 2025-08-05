// import { useJwtAuth } from "@/hooks/useJwtAuth"
import Editor from "../organisms/Editor"
import PostEditorTemplate from "../templates/PostEditorTemplate"
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";


const PostEditorPage = () => {

    // const navigate = useNavigate();
    // const {loggedIn, authChecked} = useJwtAuth();

    
    
    // useEffect(() => {
    //     if(authChecked && !loggedIn) {
    //         navigate('/login')
    //     }
    // })

    return (
        <div>
            <PostEditorTemplate panel={< div />} editor={<Editor />} />
        </div>
    )
}

export default PostEditorPage