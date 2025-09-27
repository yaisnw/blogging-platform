import ProfileCard from "../organisms/ProfileCard"
import ProfileTemplate from "../templates/ProfileTemplate"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import styles from "@/styles/ui.module.css"
import { useNavigate, useParams } from "react-router"
import { useGetMyPostsQuery } from "@/services/postsApi"
import type { blogPost, comment, responseUser } from "@/types/rtkTypes"
import PostCard from "../molecules/PostCard"
import { useAppDispatch } from "@/hooks"
import { setPostId } from "@/slices/uiSlice"
import { useEffect, useState } from "react"
import TabPanel from "../molecules/TabPanel"
import { useGetCommentsByAuthorIdQuery } from "@/services/commentsApi"
import CommentCard from "../molecules/CommentCard"
import { useChangeAvatarMutation, useChangePasswordMutation, useGetUserQuery, useLazyGetUserQuery, useUpdateUserMutation } from "@/services/userApi"
import { skipToken } from "@reduxjs/toolkit/query"
import { useAuthForm } from "@/hooks/useAuthForm"


const ProfilePage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [tabState, setTabState] = useState<'posts' | 'comments'>('posts');
    const [profileUser, setProfileUser] = useState<Omit<responseUser, "password">>({
        id: 0,
        username: '',
        email: '',
        avatar_url: ''
    });
    const { formData, handleChange } = useAuthForm([
        "username",
        "email",
    ]);

    const { formData: passwordForm, handleChange: handlePasswordInputChange } = useAuthForm([
        "currentPassword",
        "newPassword",
        "confirmPassword",
    ]);
    const user = useSelector((state: RootState) => state.auth.user);
    const { data: currentUser, isLoading: currentUserLoading } = useGetUserQuery(user.id)
    const activeUser: responseUser | undefined =
        id && Number(id) !== user?.id ? profileUser : currentUser;
    const { data: postsResponse, isLoading: postsLoading, isError: postsError } = useGetMyPostsQuery(activeUser ? { authorId: activeUser.id, publishedOnly: true } : skipToken)
    const { data: commentsResponse, isLoading: commentsLoading, isError: commentsError } = useGetCommentsByAuthorIdQuery(activeUser ? activeUser.id : skipToken)
    const [trigger] = useLazyGetUserQuery();
    const [changeAvatar, { isLoading: avatarLoading }] = useChangeAvatarMutation();
    const [updateUser, { isLoading: updateUserLoading,  error: updateUserError }] = useUpdateUserMutation();
    const [changePassword, { isLoading: changePasswordLoading, error: changePasswordError }] = useChangePasswordMutation();

    useEffect(() => {
        if (id && Number(id) === user.id) {
            setProfileUser({
                id: 0,
                username: '',
                email: '',
                avatar_url: ''
            })
            return;
        }
        const fetchDraft = async () => {
            const result = await trigger(Number(id));
            if (result.data) {
                setProfileUser(result.data)
            }
        };
        fetchDraft();
    }, [id, trigger, user.id]);

    const handlePostClick = async (id: number) => {
        dispatch(setPostId(id))
        navigate(`/home/posts/${id}`)
    }

    if (postsLoading || commentsLoading || currentUserLoading) {
        return (
            <div className={styles.loaderCenter}>
                <span className={styles.loader}></span>
            </div>
        );
    }

    const handleImageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        console.log(file)

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('image', file);
            await changeAvatar({ id: user?.id, formData }).unwrap();

        }
        catch (e) {
            console.error(e)
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUser({
            id: user?.id,
            data: {
                username: formData.username,
                email: formData.email,
            }
        }).unwrap();

    };
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        await changePassword({
            data: {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }})
        }

    if (!activeUser) {
        return (
            <div className={styles.pageError}>
                <h1 className={styles.error}>Something went wrong while fetching the user.</h1>
                <button className={styles.ctaButton} onClick={() => window.location.reload()}>
                    <p >Try again</p>
                </button>
                <button onClick={() => navigate('/home')} className={styles.ctaButton}>
                    <p>View home page</p>
                </button>
            </div>
        )
    }
    const emptyPostsResponse = postsResponse?.posts.length === 0 || !postsResponse?.posts;
    const emptyCommentsReponse = commentsResponse?.comments.length === 0 || !commentsResponse?.comments
    let contentTab;
    if (postsError || commentsError) {
        contentTab = (
            <div className={styles.pageError}>
                <h1 className={styles.error}>{`Something went wrong while fetching the ${postsError ? 'posts.' : 'comments.'}`}</h1>
                <button className={styles.ctaButton} onClick={() => window.location.reload()}>
                    <p >Try again</p>
                </button>
                <button onClick={() => navigate('/home')} className={styles.ctaButton}>
                    <p>Go back to home page</p>
                </button>
            </div>
        )
    }

    else if (emptyPostsResponse || emptyCommentsReponse) {
        contentTab = (
            <div>
                <h2 className={styles.responseInfo}>{`There are no ${emptyPostsResponse ? 'posts' : 'comments'} from this user`}</h2>
            </div>
        )
    }
    else {
        contentTab = tabState === 'posts' ? (

            postsResponse?.posts.map((post: blogPost) =>
                <PostCard
                    key={post.id}
                    postId={post.id}
                    title={post.title}
                    likeCount={post.likeCount}
                    hasLiked={post.hasLiked}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                    status={post.status}
                    viewButton={() => handlePostClick(post.id)}
                />
            ))
            :
            commentsResponse?.comments.map((comment: comment) =>
                <CommentCard
                    key={comment.id}
                    commentId={comment.id}
                    content={comment.content}
                    username={comment.User.username}
                    avatar_url={comment.User.avatar_url}
                    createdAt={comment.createdAt}
                    updatedAt={comment.updatedAt}
                />)

    }



    return (
        <ProfileTemplate
            profileCard={<ProfileCard
                username={activeUser?.username}
                email={activeUser?.email}
                password={Number(id) === user?.id ? currentUser?.password : undefined}
                avatar_url={activeUser?.avatar_url}
                formData={formData}
                passwordForm={passwordForm}
                avatarLoading={avatarLoading}
                updateUserLoading={updateUserLoading}
                changePasswordLoading={changePasswordLoading}
                updateUserError={updateUserError && updateUserError}
                changePasswordError={changePasswordError}
                handleImageInputChange={handleImageInputChange}
                handleTextInputChange={handleChange}
                handlePasswordInputChange={handlePasswordInputChange}
                updateUser={handleUpdateUser}
                changePassword={handleChangePassword}
            />}
            tabPanel={<TabPanel setTabState={setTabState} tabState={tabState} />}
            tabContent={contentTab}
        />
    )

}

export default ProfilePage




