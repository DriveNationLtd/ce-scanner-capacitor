'use client'

import { useEffect, useState } from 'react';

// import { SignOutBtn } from "@/shared/SignOutBtn";
// import { ConnectivityStatus } from "@/shared/ConnectivityStatus";
import { ConnectivityStatus } from './Connectivity';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ReSync } from './ReSync';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/about', label: 'About' },
];

export const Header: React.FC = () => {
    const location = useLocation();

    const [menuMode, setMenuMode] = useState<number>(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        // if path is events/:id, close the menu
        if (location.pathname.includes('/events/')) {
            setMenuMode(2);
        } else {
            setMenuMode(1);
        }
    }, [location.pathname]);

    return (
        <>
            <div className="bg-theme-dark h-16 w-full flex justify-between items-center px-4 z-20 fixed">
                <div className="text-white text-xl min-w-10">
                    {menuMode === 2 && (
                        <Link to={"/"}>
                            <i className="fas fa-chevron-left"></i>
                        </Link>
                    )}

                    {menuMode === 1 && (
                        <button className="relative group" onClick={toggleMenu}>
                            <div className="relative flex items-center justify-center rounded-full min-w-10 h-[50px] transform transition-all bg-theme-dark ring-0 ring-opacity-0 duration-200 shadow-md">
                                <div className={`flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 ${isMenuOpen ? 'rotate-45' : 'rotate-0'} origin-center`}>
                                    <div className={`bg-white h-[2px] w-1/2 rounded transform transition-all duration-300 ${isMenuOpen ? '-rotate-90 h-[1px] -translate-y-[1px]' : 'rotate-0'} origin-right delay-75`}></div>
                                    <div className="bg-white h-[1px] rounded"></div>
                                    <div className={`bg-white h-[2px] w-1/2 rounded self-end transform transition-all duration-300 ${isMenuOpen ? '-rotate-90 h-[1px] translate-y-[1px]' : 'rotate-0'} origin-left delay-75`}></div>
                                </div>
                            </div>
                        </button>
                    )}

                </div>
                <Link to="/">
                    <img src="/logo.png" alt="CarEvents.com" width={100} height={100} className="max-w-16" />
                </Link>
                <ConnectivityStatus />

            </div>

            <div className={`fixed top-16 left-0 bg-theme-dark w-full h-[calc(100vh-4rem)] p-4 z-40 transition-all duration-300 ${isMenuOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-[100%] pointer-events-none'}`}>
                <ul className="flex flex-col h-full justify-between">
                    <div className="top-nav flex flex-col gap-4">
                        {navLinks.map((link, index) => (
                            <li key={index} onClick={closeMenu}>
                                <Link to={link.href} className={`${location.pathname === link.href ? 'text-white/60' : 'text-white '}`}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <ReSync callback={() => closeMenu()} />
                    </div>

                    <div className="bottom-nav">
                        <li onClick={closeMenu}>
                            <Link to="/login" className="text-white">login</Link>
                        </li>
                    </div>
                </ul>
            </div>
        </>

    );
}