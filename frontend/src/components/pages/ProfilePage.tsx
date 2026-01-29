import MyProfileCard from "../organisms/MyProfileCard"
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
import { setAvatarUrl } from "@/slices/authSlice"
import { useAppDispatch } from "@/hooks"
import ReactPaginate from "react-paginate"
import styles from '@/styles/ui.module.css'

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const profileTab = useSelector((state: RootState) => state.ui.profileTab);
    
    const [postPage, setPostPage] = useState(0);
    const [commentPage, setCommentPage] = useState(0);
    const limit = 10;

    const [publicUser, setPublicUser] = useState<Omit<responseUser, "password">>({
        id: 0,
        username: '',
        email: '',
        avatar_url: ''
    });

    const { formData, handleChange } = useAuthForm(["username", "email"]);
    const { formData: passwordForm, handleChange: handlePasswordInputChange } = useAuthForm([
        "currentPassword",
        "newPassword",
        "confirmPassword",
    ]);

    const { data: currentUser, isLoading: currentUserLoading } = useGetUserQuery(user.id)
    const activeUser: responseUser | undefined = id && Number(id) !== user?.id ? publicUser : currentUser;

    const { data: postsResponse, isLoading: postsLoading, isError: postsError } = useGetMyPostsQuery(
        activeUser ? { authorId: activeUser.id, publishedOnly: true, page: postPage + 1, limit } : skipToken
    )
    const { data: commentsResponse, isLoading: commentsLoading, isError: commentsError } = useGetCommentsByAuthorIdQuery(
        activeUser ? { authorId: activeUser.id, page: commentPage + 1, limit } : skipToken
    )

    const [trigger] = useLazyGetUserQuery();
    const [changeAvatar, { isLoading: avatarLoading }] = useChangeAvatarMutation();
    const [updateUser, { isLoading: updateUserLoading, error: updateUserError }] = useUpdateUserMutation();
    const [changePassword, { isLoading: changePasswordLoading, error: changePasswordError }] = useChangePasswordMutation();

    useEffect(() => {
        if (id && Number(id) === user.id) {
            setPublicUser({ id: 0, username: '', email: '', avatar_url: '' })
            return;
        }
        const fetchDraft = async () => {
            const result = await trigger(Number(id));
            if (result.data) setPublicUser(result.data)
        };
        fetchDraft();
    }, [id, trigger, user.id]);

    const handleImageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        try {
            const formData = new FormData();
            formData.append('image', file);
            const responseUser = await changeAvatar({ id: user?.id, formData }).unwrap();
            dispatch(setAvatarUrl(responseUser.avatar_url));
        } catch (e) { console.error(e) }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUser({
            id: user?.id,
            data: { username: formData.username, email: formData.email }
        }).unwrap();
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        await changePassword({
            data: { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }
        })
    }

    const totalPostPages = Math.ceil((postsResponse?.totalCount || 0) / limit);
    const totalCommentPages = Math.ceil((commentsResponse?.totalCount || 0) / limit);

    const renderTabContent = (() => {
        if (postsError || commentsError) {
            return <ErrorState message="Something went wrong fetching data." onRetry={() => window.location.reload()} actionLabel="Go back to home page" onAction={() => navigate('/home')} />;
        }

        if (profileTab === 'posts') {
            if (!postsLoading && (!postsResponse?.posts || postsResponse.posts.length === 0)) {
                return <ErrorState mode="normal" message="No posts from this user" actionLabel="Go back to home page" onAction={() => navigate('/home')} />;
            }
            return (
                <>
                    {postsResponse?.posts.map((post: blogPost) => (
                        <PostCard key={post.id} postId={post.id} title={post.title} likeCount={post.likeCount} hasLiked={post.hasLiked} createdAt={post.createdAt} updatedAt={post.updatedAt} status={post.status} author={activeUser?.username} authorId={activeUser?.id} avatar_url={activeUser?.avatar_url} />
                    ))}
                    {totalPostPages > 1 && (
                        <div className={styles.paginationWrapper}>
                            <ReactPaginate 
                                pageCount={totalPostPages} 
                                onPageChange={(e) => { setPostPage(e.selected); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                containerClassName={styles.paginationContainer} 
                                activeClassName={styles.activePage} 
                                pageClassName={styles.pageItem}
                                previousClassName={styles.pageItem}
                                nextClassName={styles.pageItem}
                                breakClassName={styles.pageItem}
                                forcePage={postPage} 
                                previousLabel="< prev" 
                                nextLabel="next >" 
                            />
                        </div>
                    )}
                </>
            );
        }

        if (!commentsLoading && (!commentsResponse?.comments || commentsResponse.comments.length === 0)) {
            return <ErrorState mode="normal" message="No comments from this user" actionLabel="Go back to home page" onAction={() => navigate('/home')} />;
        }
        return (
            <>
                {commentsResponse?.comments.map((comment: comment) => (
                    <CommentCard key={comment.id} postTitle={comment.Post!.title} postId={comment.postId} commentId={comment.id} content={comment.content} username={comment.User!.username} authorId={comment.authorId} avatar_url={comment.User!.avatar_url} createdAt={comment.createdAt} updatedAt={comment.updatedAt!} />
                ))}
                {totalCommentPages > 1 && (
                    <div className={styles.paginationWrapper}>
                        <ReactPaginate 
                            pageCount={totalCommentPages} 
                            onPageChange={(e) => { setCommentPage(e.selected); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                            containerClassName={styles.paginationContainer} 
                            activeClassName={styles.activePage} 
                            pageClassName={styles.pageItem}
                            previousClassName={styles.pageItem}
                            nextClassName={styles.pageItem}
                            breakClassName={styles.pageItem}
                            forcePage={commentPage} 
                            previousLabel="< prev" 
                            nextLabel="next >" 
                        />
                    </div>
                )}
            </>
        );
    })();

    return (
        <>
            <SEO title="Profile" description={`View ${activeUser?.username || 'User'}'s profile.`} />
            {(currentUserLoading || postsLoading || commentsLoading) && <main><AppLoader mode="page" /></main>}
            <ProfileTemplate
                profileCard={
                    !activeUser ? (
                        !currentUserLoading && <ErrorState message='User not found' />
                    ) : (
                        user.id === Number(id) || !Number(id) ?
                        <MyProfileCard username={activeUser.username} email={activeUser.email} password={Number(id) === user?.id ? currentUser?.password : undefined} avatar_url={activeUser.avatar_url} createdAt={activeUser.createdAt ?? ''} formData={formData} passwordForm={passwordForm} avatarLoading={avatarLoading} updateUserLoading={updateUserLoading} changePasswordLoading={changePasswordLoading} updateUserError={updateUserError} changePasswordError={changePasswordError} handleImageInputChange={handleImageInputChange} handleTextInputChange={handleChange} handlePasswordInputChange={handlePasswordInputChange} updateUser={handleUpdateUser} changePassword={handleChangePassword} /> :
                        <PublicProfileCard id={activeUser.id} username={activeUser.username} email={activeUser.email} avatar_url={activeUser.avatar_url} />
                    )
                }
                tabPanel={<TabPanel mode="profile" />}
                tabContent={renderTabContent}
            />
        </>
    )
}

export default ProfilePage