// import { useJwtAuth } from "@/hooks/useJwtAuth"
import ToolBar from "../organisms/ToolBar"
import PostEditorTemplate from "../templates/PostEditorTemplate"
// import { useEffect } from "react";
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
            <PostEditorTemplate panel={< div/>} editor={<ToolBar/>} />
        </div>
    )
}

export default PostEditorPage