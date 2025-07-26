
type PostEditorProps = {
  panel: React.ReactNode;
  editor: React.ReactNode;
};

const PostEditorTemplate: React.FC<PostEditorProps>= ({panel, editor}) => {
    return (
        <div className={''}>
            <section>
                {panel}
            </section>
            <section className={'null'}>
                {editor}
            </section>
        </div>
    )
}
export default PostEditorTemplate;