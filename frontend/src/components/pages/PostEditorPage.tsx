import PostEditorTemplate from "../templates/PostEditorTemplate"
import {SimpleEditor} from '@/components/tiptap-templates/simple/simple-editor'

const PostEditorPage = () => {
    return (
        <div>
            <PostEditorTemplate panel={< div/>} editor={<SimpleEditor/>}/>
        </div>
    )
}

export default PostEditorPage