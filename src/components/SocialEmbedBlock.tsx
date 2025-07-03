"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";

const FacebookEmbed = dynamic(() => import('react-social-media-embed').then(mod => mod.FacebookEmbed), { ssr: false });
const InstagramEmbed = dynamic(() => import('react-social-media-embed').then(mod => mod.InstagramEmbed), { ssr: false });
const XEmbed = dynamic(() => import('react-social-media-embed').then(mod => mod.XEmbed), { ssr: false });
const YouTubeEmbed = dynamic(() => import('react-social-media-embed').then(mod => mod.YouTubeEmbed), { ssr: false });
const LinkedInEmbed = dynamic(() => import('react-social-media-embed').then(mod => mod.LinkedInEmbed), { ssr: false });
const PinterestEmbed = dynamic(() => import('react-social-media-embed').then(mod => mod.PinterestEmbed), { ssr: false });
const RawEmbed = dynamic(() => import("./RawEmbed"), { ssr: false });

// Memoized versions to prevent unnecessary reloads
const MemoizedFacebookEmbed = React.memo(FacebookEmbed);
const MemoizedInstagramEmbed = React.memo(InstagramEmbed);
const MemoizedXEmbed = React.memo(XEmbed);
const MemoizedYouTubeEmbed = React.memo(YouTubeEmbed);
const MemoizedLinkedInEmbed = React.memo(LinkedInEmbed);
const MemoizedPinterestEmbed = React.memo(PinterestEmbed);

export default function SocialEmbedBlock({ value }: { value: { platform: string, url?: string, code?: string, width?: number, height?: number } }) {
  if (!value?.platform) return null;
  let embed = null;
  const platformLabel = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'X',
    x: 'X',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    pinterest: 'Pinterest',
    embed_code: 'Embed Code',
    other: 'Embed',
  }[value.platform] || 'Embed';
  const containerClass = `relative rounded-2xl border-2 border-purple-500/60 bg-gradient-to-br from-black via-purple-950 to-black shadow-xl overflow-hidden max-w-full w-[min(100%,500px)] group`;
  const borderGlow = `absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-400/0 via-purple-500/80 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`;
  const width = value.width || (value.platform === 'instagram' ? 328 : 500);
  const height = value.height;
  switch (value.platform) {
    case 'facebook':
      if (!value.url) return null;
      embed = <MemoizedFacebookEmbed url={value.url} width={width} {...(height ? { height } : {})} />;
      break;
    case 'instagram':
      if (!value.url) return null;
      embed = <MemoizedInstagramEmbed url={value.url} width={width} {...(height ? { height } : {})} />;
      break;
    case 'twitter':
    case 'x':
      if (!value.url) return null;
      embed = <MemoizedXEmbed key={value.url} url={value.url} width={width} {...(height ? { height } : {})} />;
      break;
    case 'linkedin':
      if (!value.url) return null;
      embed = <MemoizedLinkedInEmbed url={value.url} width={width} {...(height ? { height } : {})} />;
      break;
    case 'pinterest':
      if (!value.url) return null;
      embed = (
        <div
          className="pinterest-embed-wrapper rounded-2xl overflow-hidden"
          style={{
            width: width,
            height: height,
            maxWidth: '100%',
            margin: '0 auto',
            background: 'black'
          }}
        >
          <MemoizedPinterestEmbed
            url={value.url}
            width={width}
            height={height}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      );
      break;
    case 'youtube': {
      if (!value.url) return null;
      let ytUrl = value.url;
      try {
        const url = new URL(value.url);
        let videoId = '';
        if (url.hostname === 'youtu.be') {
          videoId = url.pathname.slice(1);
        } else if (url.hostname.includes('youtube.com')) {
          videoId = url.searchParams.get('v') || '';
        }
        if (videoId) {
          ytUrl = `https://www.youtube.com/embed/${videoId}?controls=0&rel=0&modestbranding=1`;
        }
      } catch (e) {
        // Invalid URL, fallback to value.url
      }
      embed = <MemoizedYouTubeEmbed url={ytUrl} width={width} {...(height ? { height } : {})} />;
      break;
    }
    case 'embed_code':
      if (!value.code) return null;
      embed = <RawEmbed code={value.code} />;
      break;
    case 'other':
      if (!value.url) return null;
      embed = (
        <div className="flex flex-col items-center justify-center p-6">
          <iframe
            src={value.url}
            className="w-full rounded-lg border border-purple-400/40 bg-black/40"
            style={{ height: height ? height : 'fit-content' }}
            sandbox="allow-scripts allow-same-origin allow-popups"
            allowFullScreen
            loading="lazy"
            title="Embedded content"
          />
          <span className="text-xs text-purple-300 mt-2 mb-1">If the embed does not load, <a href={value.url} className="underline" target="_blank" rel="noopener noreferrer">view content</a>.</span>
        </div>
      );
      break;
    default:
      if (!value.url) return null;
      embed = <a href={value.url} className="text-purple-400 underline break-all" target="_blank" rel="noopener noreferrer">{value.url}</a>;
  }
  return (
    <div className="my-8 flex flex-col items-center">
      <span className="mb-2 px-3 py-0.5 rounded-full bg-purple-900/70 text-purple-300 text-xs font-semibold tracking-wide uppercase shadow-sm border border-purple-700/40">{platformLabel}</span>
      <div className={containerClass} style={{ height: height ? height : 'fit-content' }}>
        <div className={borderGlow} />
        <div className="relative z-10">{embed}</div>
      </div>
    </div>
  );
}
