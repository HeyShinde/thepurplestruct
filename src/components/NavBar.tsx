"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { FaExternalLinkAlt } from "react-icons/fa"
import { useEffect, useRef, useState } from "react"

const navItems = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
]

const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/heyshinde" },
    { name: "Linkedin", href: "https://linkedin.com/in/heyshinde" },
]

export function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [showNav, setShowNav] = useState(true);
    const lastScrollY = useRef(0);
    const [direction, setDirection] = useState(1);

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

    return (
        <>
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
                            <Link href="/" className="z-50">
                                <span className="text-base md:text-lg text-black" style={{ fontFamily: 'var(--font-silkscreen)' }}>
                                    <span style={{ fontWeight: 700 }}>Hey</span>Shinde
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
                                className={`overflow-hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                style={{ willChange: 'height, opacity' }}
                            >
                                {/* Navigation Links */}
                                <nav className="space-y-4 md:space-y-6 mb-6 md:mb-8 mt-4 md:mt-6">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="block text-base md:text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                {/* Contact button - Hidden on mobile */}
                <div className="hidden md:block">
                    <motion.div
                        className="absolute top-14 right-24"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button className="relative inline-flex h-[48px] w-[11rem] overflow-hidden rounded-2xl p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-white px-6 py-2 text-lg font-semibold text-zinc-900 backdrop-blur-3xl">
                                Contact
                            </span>
                        </button>
                    </motion.div>
                </div>
            </motion.header>
        </>
    )
}
