import ProfileCard from "../organisms/MyProfileCard"
import ProfileTemplate from "../templates/ProfileTemplate"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { useNavigate, useParams } from "react-router"
import { useGetMyPostsQuery } from "@/services/postsApi"
import type { blogPost, comment, responseUser } from "@/types/rtkTypes"
import PostCard from "../molecules/PostCard"
import { useEffect, useState } from "react"
import TabPanel from "../molecules/TabPanel"
import { useGetCommentsByAuthorIdQuery } from "@/services/commentsApi"
import CommentCard from "../molecules/CommentCard"
import { useChangeAvatarMutation, useChangePasswordMutation, useGetUserQuery, useLazyGetUserQuery, useUpdateUserMutation } from "@/services/userApi"
import { skipToken } from "@reduxjs/toolkit/query"
import { useAuthForm } from "@/hooks/useAuthForm"
import PublicProfileCard from "../organisms/PublicProfileCard"
import AppLoader from "../atoms/AppLoader"
import ErrorState from "../atoms/ErrorState"
import SEO from "../atoms/SEO"


const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const tabState = useSelector((state: RootState) => state.ui.tabState);
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
    const { data: currentUser, isLoading: currentUserLoading } = useGetUserQuery(user.id)
    const activeUser: responseUser | undefined =
        id && Number(id) !== user?.id ? profileUser : currentUser;
    const { data: postsResponse, isLoading: postsLoading, isError: postsError } = useGetMyPostsQuery(activeUser ? { authorId: activeUser.id, publishedOnly: true } : skipToken)
    const { data: commentsResponse, isLoading: commentsLoading, isError: commentsError } = useGetCommentsByAuthorIdQuery(activeUser ? activeUser.id : skipToken)
    const [trigger] = useLazyGetUserQuery();
    const [changeAvatar, { isLoading: avatarLoading }] = useChangeAvatarMutation();
    const [updateUser, { isLoading: updateUserLoading, error: updateUserError }] = useUpdateUserMutation();
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
            }
        })
    }

    if (currentUserLoading || postsLoading || commentsLoading) {
        return (<main>
            <AppLoader mode="page" />
        </main>)
    }

    const emptyPostsResponse = postsResponse?.posts.length === 0 || !postsResponse?.posts;
    const emptyCommentsReponse = commentsResponse?.comments.length === 0 || !commentsResponse?.comments
    let contentTab;
    if (postsError || commentsError) {
        contentTab = (
            <ErrorState message={`Something went wrong while fetching the ${postsError ? 'posts.' : 'comments.'}`} onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />
        )
    }

    else if (emptyPostsResponse || emptyCommentsReponse) {
        contentTab = (
            <ErrorState mode="normal" message={`There are no ${emptyPostsResponse ? 'posts' : 'comments'} from this user`} />
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

    if (!activeUser) {
        return (

            <main>
                <ErrorState message='Something went wrong while fetching the user.' onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />
            </main>

        )
    }

    return (
        <>
            <SEO title="Profile" description={`View ${activeUser.username}'s profile to explore their activity.`} />
            {(postsLoading || commentsLoading || currentUserLoading) && <AppLoader mode="page" />}
            {!activeUser && <ErrorState message='Something went wrong while fetching the user.' onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />}
            <ProfileTemplate
                profileCard={user.id === Number(id) || !Number(id) ?
                    <ProfileCard
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
                    /> :
                    <PublicProfileCard
                        id={activeUser?.id}
                        username={activeUser?.username}
                        email={activeUser?.email}
                        avatar_url={activeUser?.avatar_url}
                    />
                }
                tabPanel={<TabPanel mode="profile" />}
                tabContent={contentTab}
            />
        </>
    )

}

export default ProfilePage




