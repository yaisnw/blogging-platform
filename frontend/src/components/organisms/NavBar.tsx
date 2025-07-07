import { useEffect, useState } from 'react';
import AppLink from '../atoms/AppLink';
import { Outlet } from 'react-router';
import styles from '../../styles/nav.module.css'

const NavBar = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    let token
    useEffect(() => {
        token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true)
        }
        else {
            setLoggedIn(false)
        }
    })
    const logOutHandler = (e: React.MouseEvent) => {
        e.preventDefault();


    }


    return (
        <>
            <header>
                <nav className={styles.nav}>
                    {loggedIn ? (
                        <>
                            <div className={styles.nav1}>
                                <AppLink to="/home">Home</AppLink>
                                <AppLink to="/blogs">Blogs</AppLink>
                                <AppLink to="/myBlogs">My Blogs</AppLink>
                            </div>
                            <div className={styles.nav1}>
                                <AppLink to="/profile">Profile</AppLink>
                                <AppLink to="/support">Support</AppLink>
                                <a href="#" onClick={logOutHandler}>Log out</a>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.nav1}>
                                <AppLink to="/home">Home</AppLink>
                                <AppLink to="/blogs">Blogs</AppLink>
                            </div>
                            <div className={styles.nav1}>
                                <AppLink to="/support">Support</AppLink>
                                <AppLink to="/login">Log in</AppLink>
                                <AppLink to="/signup">Get Started</AppLink>
                            </div>
                        </>
                    )}
                </nav>
            </header>
            <Outlet />
        </>
    )

    // else if (loggedIn) {
    //     return (
    //         <div>
    //             <nav className={styles.nav}>
    //                 <div className={styles.nav1}>
    //                     <AppLink to='./home' >Home</AppLink>
    //                     <AppLink to=''>Blogs</AppLink>
    //                     <AppLink to='/myBlogs'>My Blogs</AppLink>
    //                 </div>
    //                 <div className={styles.nav1}>
    //                     <AppLink to='../profile'>Profile</AppLink>
    //                     <AppLink to='../support' >Support</AppLink>
    //                     <a href='#' onClick={logOutHandler} >Log out</a>
    //                 </div>
    //             </nav>
    //             <Outlet />
    //         </div>
    //     )
    // }
}

export default NavBar