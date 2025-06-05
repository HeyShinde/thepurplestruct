'use client';

import React from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaLink } from 'react-icons/fa';

interface ShareButtonsProps {
    url: string;
    title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
    const shareLinks = [
        {
            platform: "Twitter",
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            icon: <FaTwitter className="text-purple-400" />,
        },
        {
            platform: "Facebook",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            icon: <FaFacebook className="text-purple-400" />,
        },
        {
            platform: "LinkedIn",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            icon: <FaLinkedin className="text-purple-400" />,
        },
        {
            platform: "Copy Link",
            url: "#",
            icon: <FaLink className="text-purple-400" />,
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).then(() => {
                        alert("Link copied to clipboard!");
                    }).catch(err => {
                        console.error("Failed to copy: ", err);
                        alert("Failed to copy the link. Please try again.");
                    });
                } else {
                    alert("Copy to clipboard is not supported in this browser. Please manually copy the link.");
                }
            },
        },
    ];

    return (
        <>
            {/* Large Screen Layout */}
            <div className="sticky top-28 left-0 hidden lg:flex flex-col space-y-4">
                {shareLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target={link.platform === "Copy Link" ? "" : "_blank"}
                        rel="noopener noreferrer"
                        onClick={link.onClick}
                        className="flex items-center justify-center w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-black/90 transition-colors duration-200 border border-purple-400/20"
                    >
                        {link.icon}
                    </a>
                ))}
            </div>

            {/* Small Screen Layout */}
            <div className="lg:hidden flex space-x-4 justify-center mt-4">
                {shareLinks.slice(0, 3).map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-black/90 transition-colors duration-200 border border-purple-400/20"
                    >
                        {link.icon}
                    </a>
                ))}
            </div>
        </>
    );
};

export default ShareButtons;