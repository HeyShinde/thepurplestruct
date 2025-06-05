'use client';

import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface KatexBlockComponentProps {
    expression: string;
    index: number; // Use the index as a consistent identifier
}

const KatexBlockComponent: React.FC<KatexBlockComponentProps> = ({ expression, index }) => {
    const katexElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (katexElementRef.current) {
            katex.render(expression, katexElementRef.current, {
                throwOnError: false,
            });
        }
    }, [expression]);

    return <div id={`katex-block-${index}`} ref={katexElementRef} className="katex-block" />;
};

export default KatexBlockComponent; 