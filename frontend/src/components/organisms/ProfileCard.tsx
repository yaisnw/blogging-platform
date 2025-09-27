import AppImage from "../atoms/AppImage"
import styles from "@/styles/profilePage.module.css"
import UIstyles from "@/styles/ui.module.css"
import AuthField from "../molecules/AuthField"
import AppInput from "../atoms/AppInput";
import AppButton from "../atoms/AppButton";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import {  isFetchBaseQueryError } from "@/utils/isFetchBaseQueryError";
import type { SerializedError } from "@reduxjs/toolkit";

type ProfileCardProps = {
    username: string,
    email: string,
    password: string | undefined,
    avatar_url: string,
    formData: Record<string, string>,
    passwordForm: Record<string, string>,
    avatarLoading: boolean,
    updateUserLoading: boolean,
    changePasswordLoading: boolean,
    updateUserError: FetchBaseQueryError | SerializedError | undefined,
    changePasswordError: FetchBaseQueryError | SerializedError | undefined,
    handleTextInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleImageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handlePasswordInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    updateUser: (e: React.FormEvent) => void,
    changePassword: (e: React.FormEvent) => void
}



const ProfileCard: React.FC<ProfileCardProps> = ({ username, email, avatar_url, formData, passwordForm, avatarLoading, updateUserLoading, changePasswordLoading, updateUserError, changePasswordError, handleTextInputChange, handleImageInputChange, handlePasswordInputChange, updateUser, changePassword }) => {
    const [errorMessage, setErrorMessage] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    useEffect(() => {
        setErrorMessage('')
        const error = changePasswordError || updateUserError
        console.log(error)
        if (!error) {
            setIsChangingPassword(false)
            setIsEditing(false)
        }
        
        if (isFetchBaseQueryError(error)) {
            const errData = error.data as { message?: string }
            setErrorMessage(errData?.message ?? 'Something went wrong')
        }
        else {
            setErrorMessage('Unknown error')
        }
    }, [changePasswordError, updateUserError])

    if (updateUserLoading || changePasswordLoading) {
        return (
            <div className={UIstyles.loaderContainer}>
                <span className={UIstyles.loader}></span>
            </div>
        )
    }
    return !isEditing ?
        (!isChangingPassword ? (
            <section className={styles.profileCard}>
                <AppImage className={styles.profilePicture} src={avatar_url} />
                <div className={styles.userInfoBox}>
                    <p>Username: <span className={styles.userInfo}>{username}</span></p>
                    <p>Email: <span className={styles.userInfo}>{email}</span></p>
                </div>
                <button onClick={() => setIsEditing(true)} >Edit Profile</button>
                <AppButton onClick={() => setIsChangingPassword(true)} >Change Password</AppButton>
            </section>
        )
            :
            (<>
                <form className={styles.editingProfileCard} onSubmit={(e: React.FormEvent) => { changePassword(e); }}>
                    <AppButton type="button" onClick={() => { setIsChangingPassword(false); setIsEditing(false) }} >Cancel</AppButton>
                    {errorMessage && <p>{errorMessage}</p>}
                    <AuthField
                        name="currentPassword"
                        label="Enter your current password:"
                        type="password"
                        autoComplete="current-password"
                        value={passwordForm.currentPassword || ""}
                        onChange={handlePasswordInputChange}
                    />
                    <AuthField
                        name="newPassword"
                        label="Enter your new password:"
                        type="password"
                        autoComplete="new-password"
                        value={passwordForm.newPassword || ""}
                        onChange={handlePasswordInputChange}
                    />
                    <AuthField
                        name="confirmPassword"
                        label="Confirm your new password:"
                        type="password"
                        autoComplete="confirm-password"
                        value={passwordForm.confirmPassword || ""}
                        onChange={handlePasswordInputChange}
                    />
                    <AppButton>Change Password</AppButton>
                </form>
            </>)

        )
        :
        (
            <>
                <form className={styles.editingProfileCard} onSubmit={(e: React.FormEvent) => { updateUser(e); setIsEditing(false) }}>
                <AppButton type="button" onClick={() => setIsEditing(false)} >Cancel</AppButton>
                    {avatarLoading
                        ?
                        <span className={UIstyles.loader}></span>
                        :
                        <>
                            <AppImage className={styles.profilePicture} src={avatar_url} />
                            <AppInput id="avatar" type="file" accept="image/*" onChange={handleImageInputChange} />
                        </>
                    }
                    <AuthField
                        name="username"
                        label="Enter your username:"
                        autoComplete="username"
                        value={formData.username || ""}
                        onChange={handleTextInputChange}
                    />


                    <AuthField
                        name="email"
                        label="Enter your email:"
                        type="email"
                        autoComplete="email"
                        value={formData.email || ""}
                        onChange={handleTextInputChange}
                    />
                    <AppButton>Update</AppButton>
                </form>
            </>
        )
}

export default ProfileCard  




































// send current avatar_url to backend and if it exists in the bucket then delete it and add the new avatar