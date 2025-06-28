"use client";

import { useEffect, useRef } from 'react';

interface ScriptExecutorProps {
    htmlContent: string;
    className?: string;
}

const ScriptExecutor: React.FC<ScriptExecutorProps> = ({ htmlContent, className = "" }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Execute any scripts that were inserted via dangerouslySetInnerHTML
            const scripts = containerRef.current.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = script.textContent;
                script.parentNode?.replaceChild(newScript, script);
            });
        }
    }, [htmlContent]);

    return (
        <div 
            ref={containerRef}
            className={className}
            dangerouslySetInnerHTML={{ 
                __html: htmlContent
                    .replace(/<\/?html>/g, '')
                    .replace(/<\/?body>/g, '')
                    .replace(/<\/?head>/g, '')
            }} 
        />
    );
};

export default ScriptExecutor; 