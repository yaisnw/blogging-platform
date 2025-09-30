import AppLink from '../atoms/AppLink';
import { Outlet, useNavigate } from 'react-router';
import styles from '../../styles/nav.module.css'
import { useEffect } from 'react';
import { persistor } from '@/store';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useAppDispatch } from '@/hooks';
import { logOut } from '@/slices/authSlice';
import SearchBar from '../molecules/SearchBar';


const NavBar = () => {
    const dispatch = useAppDispatch();
    const { loggedIn, authChecked } = useAuthStatus();
    const navigate = useNavigate();
    


    useEffect(() => {
        if (!loggedIn && authChecked) {
            dispatch(logOut())
            navigate('/login')
        }
    }, [dispatch, navigate, loggedIn, authChecked])

    const logOutHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('token')
        persistor.purge();
        navigate('/login')
    }


    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.nav1}>
                    <AppLink to="/home">Home</AppLink>
                    <AppLink to="/home/posts">Posts</AppLink>
                    {loggedIn && <AppLink to="myPosts">My Posts</AppLink>}
                </div>
                <SearchBar />
                <div className={styles.nav1}>
                    {loggedIn && <AppLink to="/home/profile">Profile</AppLink>}
                    <AppLink to="/home/support">Support</AppLink>
                    <a href="#" onClick={logOutHandler}>Log out</a>
                </div>
            </nav>
            <Outlet />
        </>
    )

}

export default NavBar