"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { FaExternalLinkAlt, FaUserCircle, FaSignInAlt, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa"
import { useEffect, useRef, useState } from "react"
import { ContactModal } from "./ContactModal"
import { useSession, signOut } from "next-auth/react"
import { useMediaQuery } from 'react-responsive'
import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { CommandPalette } from "./CommandPalette"
import { SearchBox } from "./SearchBox"

const socialLinks = [
    { name: "Linkedin", href: "https://www.linkedin.com/in/heyshinde" },
    { name: "Github", href: "https://github.com/heyshinde" },
]

export function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [showNav, setShowNav] = useState(true);
    const lastScrollY = useRef(0);
    const [direction, setDirection] = useState(1);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { data: session, status } = useSession();
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
    const [navItems, setNavItems] = useState<any[]>([]);
    const [hasMounted, setHasMounted] = useState(false);
    const [isCommandOpen, setCommandOpen] = useState(false)

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        async function fetchNavItems() {
            const data = await client.fetch(groq`
                *[_type == "navigation" && slug.current == "main-menu"][0]{
                    items
                }
            `);
            setNavItems(data.items);
        }
        fetchNavItems();
    }, []);

    useEffect(() => {
        let ticking = false;
        const threshold = 8;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    if (currentScrollY < 10) {
                        setShowNav(true);
                    } else if (currentScrollY > lastScrollY.current + threshold) {
                        setShowNav(false); // scrolling down
                    } else if (currentScrollY < lastScrollY.current - threshold) {
                        setShowNav(true); // scrolling up
                    }
                    lastScrollY.current = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setDirection((d) => -d), 2000);
        return () => clearInterval(interval);
    }, []);

    // Close user menu on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        if (userMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuOpen]);

    // Toggle the menu when ⌘K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setCommandOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const menuContentVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
            },
        },
        open: {
            opacity: 1,
            height: 'auto',
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    }

    if (!hasMounted) {
        return null;
    }

    return (
        <>
            {/* Contact Modal */}
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            <CommandPalette open={isCommandOpen} setOpen={setCommandOpen} />
            <motion.header
                initial={{ y: 0 }}
                animate={{ y: showNav ? 0 : -120 }}
                transition={{ type: 'tween', duration: 0.35 }}
                className="fixed top-0 left-0 right-0 z-50 w-full h-0"
            >
                {/* Menu Card (always visible) */}
                <motion.div
                    className="absolute top-4 md:top-10 left-4 md:left-20 bg-white rounded-2xl px-4 md:px-8 py-2 shadow-lg w-[calc(100%-2rem)] md:w-[400px] flex flex-col items-stretch min-h-[48px]"
                >
                    {/* Top Row: Logo + Profile Image + Hamburger/X */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Profile Image */}
                            <Link href="/">
                            <motion.div
                                className="relative"
                                initial={false}
                                animate={{
                                    width: isMenuOpen ? 48 : 40,
                                    height: isMenuOpen ? 48 : 40,
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <Image
                                    src="/images/profile-img.webp"
                                    alt="Profile"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                                <motion.span
                                    initial={{ opacity: 0, scale: 0, rotate: -20 }}
                                    animate={{ 
                                        opacity: isMenuOpen ? 1 : 0,
                                        scale: isMenuOpen ? 1 : 0,
                                        rotate: isMenuOpen ? [0, -10, 10, -10, 0] : -20,
                                    }}
                                    transition={{ 
                                        duration: 0.5,
                                        rotate: {
                                            duration: 1,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }
                                    }}
                                    className="absolute -right-2 -top-2 text-2xl"
                                >
                                    👋
                                </motion.span>
                            </motion.div>
                            </Link>
                            <Link href="/" className="z-50">
                                <span className="font-heading glitch-effect text-base md:text-lg text-black">
                                    Hey<span style={{ fontWeight: 700 }}>Shinde</span>
                                </span>
                            </Link>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen((v) => !v)}
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="relative z-50 flex items-center justify-center p-3 focus:outline-none"
                        >
                            <div className="relative w-[48px] md:w-[72px] h-8 flex flex-col items-center justify-center">
                                {/* Top bar */}
                                <motion.div
                                    animate={isMenuOpen ? {
                                        rotate: 45,
                                        y: 14,
                                    } : {
                                        rotate: 0,
                                        y: 0,
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    className="absolute w-[48px] md:w-[72px] h-[1px] bg-purple-600 rounded"
                                    style={{ top: 8 }}
                                />
                                {/* Middle bar */}
                                <motion.div
                                    animate={isMenuOpen ? {
                                        opacity: 0,
                                        scaleX: 0.5,
                                    } : {
                                        opacity: 1,
                                        scaleX: 1,
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    className="absolute w-[48px] md:w-[72px] h-[1px] bg-purple-600 rounded"
                                    style={{ top: 16 }}
                                />
                                {/* Bottom bar */}
                                <motion.div
                                    animate={isMenuOpen ? {
                                        rotate: -45,
                                        y: -14,
                                    } : {
                                        rotate: 0,
                                        y: 0,
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    className="absolute w-[48px] md:w-[72px] h-[1px] bg-purple-600 rounded"
                                    style={{ top: 24 }}
                                />
                            </div>
                        </button>
                    </div>
                    {/* Animated Menu Content */}
                    <AnimatePresence initial={false}>
                        {isMenuOpen && (
                            <motion.div
                                key="menu-content"
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={menuContentVariants}
                                className={`${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'} overflow-y-auto max-h-[80vh]`}
                                style={{ willChange: 'height, opacity' }}
                            >
                                {/* Navigation Links */}
                                <nav className="space-y-4 md:space-y-6 mb-6 md:mb-8 mt-4 md:mt-6">
                                    {/* SearchBox for mobile */}
                                    {!isDesktop && (
                                        <div className="relative mb-4">
                                            <SearchBox/>
                                        </div>
                                    )}
                                    
                                    <div className="h-px bg-gray-200" />
                                    {navItems && navItems.filter(item =>
                                        isDesktop ? item.show === 'both' || item.show === 'desktop' : item.show === 'both' || item.show === 'mobile').map((item) => {
                                        if (item.title === 'Contact' && !isDesktop) {
                                            return (
                                                <div key={item.title}>
                                                    <button
                                                        onClick={() => {
                                                            setIsContactOpen(true);
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className="block w-full text-left text-base md:text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                                    >
                                                        {item.title}
                                                    </button>
                                                </div>
                                            )
                                        }
                                        return (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className="block text-base md:text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {item.title}
                                            </Link>
                                        )
                                    })}
                                </nav>
                                {/* Divider */}
                                <div className="h-px bg-gray-200 mb-6" />
                                {/* Social Links */}
                                <div className="flex gap-4 md:gap-8 mb-6 md:mb-8">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                        >
                                            {social.name}
                                            <FaExternalLinkAlt className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                                {/* User Actions for Mobile */}
                                <div className="h-px bg-gray-200 mb-6" />
                                <div className="flex gap-4 md:gap-8 mb-6 md:mb-8">
                                    {status === "authenticated" ? (
                                        <>
                                            <Link href="/dashboard" className="flex items-center gap-2 text-base font-medium text-gray-900 hover:text-gray-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                                <FaTachometerAlt className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                            <button
                                                className="flex items-center gap-2 w-full text-left text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                                onClick={() => { signOut(); setIsMenuOpen(false); }}
                                            >
                                                <FaSignOutAlt className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                        <Link href="/auth/signin" className="flex items-center gap-2 text-base font-medium text-gray-900 hover:text-gray-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                            <FaSignInAlt className="w-4 h-4" />
                                            Login
                                        </Link>
                                        <Link href="/auth/signup" className="flex items-center gap-2 text-base font-medium text-gray-900 hover:text-gray-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                            <FaSignInAlt className="w-4 h-4" />
                                            Signup
                                        </Link>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                {/* Contact button & desktop nav */}
                {isDesktop && (
                <div className="hidden md:flex items-center gap-4 absolute top-14 right-24">
                    {/* <button
                        onClick={() => setCommandOpen(true)}
                        className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/80 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-md transition-colors hover:bg-gray-700/80"
                        >
                        <SparklesIcon className="h-5 w-5 text-purple-400" />
                        <span>Search...</span>
                        <kbd className="ml-2 rounded border border-gray-600 px-1.5 py-0.5 text-xs">⌘K</kbd>
                    </button> */}
                    <SearchBox/>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button
                            className="relative inline-flex h-[48px] w-[11rem] overflow-hidden rounded-2xl p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                            onClick={() => setIsContactOpen(true)}
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-white px-6 py-2 text-lg font-semibold text-zinc-900 backdrop-blur-3xl">
                                Contact
                            </span>
                        </button>
                    </motion.div>
                    {/* User Icon and Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            className="ml-4 w-10 h-10 rounded-full bg-gradient-to-r from-purple-950 to-blue-800 flex items-center justify-center shadow-lg focus:outline-none transition-transform duration-200 hover:scale-120 active:scale-100 hover:shadow-2xl border-2"
                            onClick={() => setUserMenuOpen((v) => !v)}
                            aria-label="User menu"
                        >
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt="User profile"
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 drop-shadow-lg animate-pulse-slow"
                                    animate={{ rotate: userMenuOpen ? 20 : 0, scale: userMenuOpen ? 1.1 : 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M12 14c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z" />
                                </motion.svg>
                            )}
                        </button>
                        <AnimatePresence>
                        {userMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.18, type: 'spring', stiffness: 300, damping: 24 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border origin-top-right"
                            >
                                {status === "authenticated" ? (
                                    <>
                                        <Link href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                                            Dashboard
                                        </Link>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                            onClick={() => { setUserMenuOpen(false); signOut(); }}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                    <Link href="/auth/signin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link href="/auth/signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                                        Signup
                                    </Link>
                                    </>
                                )}
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                </div>
                )}
            </motion.header>
        </>
    )
}
