'use client';
import React, { useState } from 'react';

const SubscribeForm = ({ title = "Never miss what's next", description = "Subscribe to our newsletter for the latest updates." }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('Subscribing...');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    tags: ['interested:ml'],
                    formId: '6593057',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('✅ Subscription successful! Check your email inbox or spam to confirm.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(`❌ ${data.error || 'Something went wrong. Please try again.'}`);
            }
        } catch {
            setStatus('error');
            setMessage('❌ An error occurred. Please try again later.');
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">{title}</h2>
            <form onSubmit={handleSubmit} className="flex flex-row items-center gap-2 w-full max-w-xl">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full bg-transparent border-b-2 border-purple-400/40 py-2 px-0 text-base md:text-xl placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors text-purple-100 font-mono"
                    required
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex items-center gap-2 text-base md:text-lg font-mono tracking-wider bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-purple-500 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="text-xl md:text-2xl">↳</span> {status === 'loading' ? 'SENDING...' : 'SUBMIT'}
                </button>
            </form>
            {message && (
                <p className={`text-sm mt-4 font-mono ${status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-purple-400/80'}`}>
                    {message}
                </p>
            )}
            <p className="text-purple-400/80 text-sm mt-4 max-w-lg font-mono">
                {description}
            </p>
        </div>
    );
};

export default SubscribeForm;