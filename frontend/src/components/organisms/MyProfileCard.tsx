import AppImage from "../atoms/AppImage";
import styles from "@/styles/profilePage.module.css";
import UIstyles from "@/styles/ui.module.css"
import AuthField from "../molecules/AuthField";
import AppInput from "../atoms/AppInput";
import AppButton from "../atoms/AppButton";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { isFetchBaseQueryError } from "@/utils/isFetchBaseQueryError";
import type { SerializedError } from "@reduxjs/toolkit";
import AppLabel from "../atoms/AppLabel";
import AppLoader from "../atoms/AppLoader";
import ErrorMessage from "../atoms/ErrorState";
import AppHeading from "../atoms/AppHeading";
import { motion, AnimatePresence } from "motion/react";

type MyProfileCardProps = {
    username: string;
    email: string;
    password: string | undefined;
    avatar_url: string;
    createdAt: string;
    formData: Record<string, string>;
    passwordForm: Record<string, string>;
    avatarLoading: boolean;
    updateUserLoading: boolean;
    changePasswordLoading: boolean;
    updateUserError: FetchBaseQueryError | SerializedError | undefined;
    changePasswordError: FetchBaseQueryError | SerializedError | undefined;
    handleTextInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePasswordInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateUser: (e: React.FormEvent) => void;
    changePassword: (e: React.FormEvent) => void;
};

const MyProfileCard: React.FC<MyProfileCardProps> = ({
    username,
    email,
    avatar_url,
    createdAt,
    formData,
    passwordForm,
    avatarLoading,
    updateUserLoading,
    changePasswordLoading,
    updateUserError,
    changePasswordError,
    handleTextInputChange,
    handleImageInputChange,
    handlePasswordInputChange,
    updateUser,
    changePassword,
}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const formattedCreatedAt = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        setErrorMessage("");
        const error = changePasswordError || updateUserError;
        if (!error) {
            setIsChangingPassword(false);
            setIsEditing(false);
        }

        if (isFetchBaseQueryError(error)) {
            const errData = error.data as { message?: string };
            setErrorMessage(errData?.message ?? "Something went wrong");
        }
    }, [changePasswordError, updateUserError]);

    useEffect(() => {
        return () => {
            setErrorMessage("");
        };
    }, [setErrorMessage]);

    if (updateUserLoading || changePasswordLoading) {
        return (
            <main>
                <AppLoader mode="page" />
            </main>
        );
    }

    return (
        <AnimatePresence mode="wait">
            {!isEditing && !isChangingPassword && (
                <motion.article
                    key="profileView"
                    className={styles.profileCard}
                    initial={{ opacity: 0.6, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <AppHeading>Profile</AppHeading>
                    <div className={styles.infoSection}>
                        <AppImage className={styles.profilePicture} src={avatar_url} />
                        <div className={styles.userInfoBox}>
                            <p>
                                Username: <span className={styles.userName}>{username}</span>
                            </p>
                            <p>
                                Email: <span className={styles.userDetail}>{email}</span>
                            </p>
                            <p>
                                Date Joined:{" "}
                                <span className={styles.userDetail}>{formattedCreatedAt}</span>
                            </p>
                        </div>
                    </div>
                    <div className={styles.buttonBox}>
                        <AppButton onClick={() => setIsEditing(true)}>Edit Profile</AppButton>
                        <AppButton onClick={() => setIsChangingPassword(true)}>
                            Change Password
                        </AppButton>
                    </div>
                </motion.article>
            )}

            {isChangingPassword && (
                <motion.form
                    key="passwordForm"
                    className={styles.passwordFormContainer}
                    initial={{ opacity: 0.6, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={(e: React.FormEvent) => {
                        changePassword(e);
                    }}
                >
                    {errorMessage && <ErrorMessage message={errorMessage} />}
                    <AppHeading>Change Password</AppHeading>
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
                    <div className={styles.editingFooter}>
                        <AppButton
                            variant="secondary"
                            type="button"
                            onClick={() => {
                                setIsChangingPassword(false);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </AppButton>
                        <AppButton type="submit">Change Password</AppButton>
                    </div>
                </motion.form>
            )}

            {isEditing && (
                <motion.form
                    key="editForm"
                    className={styles.editingProfileCard}
                    initial={{ opacity: 0.6, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={(e: React.FormEvent) => {
                        updateUser(e);
                        setIsEditing(false);
                    }}
                >
                    <AppHeading>Update Profile</AppHeading>
                    <div className={styles.formContainer}>
                        {avatarLoading ? (
                            <AppLoader />
                        ) : (
                            <div className={styles.avatarContainer}>
                                <AppImage className={styles.profilePicture} src={avatar_url} />
                                <AppLabel className={UIstyles.appLink} htmlFor="avatar">
                                    Choose Image
                                </AppLabel>
                                <AppInput
                                    style={{ display: "none" }}
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageInputChange}
                                />
                            </div>
                        )}
                        <div className={styles.editingFieldset}>
                            <AuthField
                                name="username"
                                placeholder="Enter your username"
                                autoComplete="username"
                                value={formData.username || ""}
                                onChange={handleTextInputChange}
                            />
                            <AuthField
                                name="email"
                                placeholder="Enter your email"
                                type="email"
                                autoComplete="email"
                                value={formData.email || ""}
                                onChange={handleTextInputChange}
                            />
                        </div>
                    </div>
                    <div className={styles.editingFooter}>
                        <AppButton
                            variant="secondary"
                            type="button"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </AppButton>
                        <AppButton type="submit">Update</AppButton>
                    </div>
                </motion.form>
            )}
        </AnimatePresence>
    );
};

export default MyProfileCard;
