'use client';

import React from 'react';

const BackgroundCard = ({ className, style, delay }: { className?: string, style?: React.CSSProperties, delay?: string }) => (
    <div
        className={`floating-card p-5 flex flex-col gap-3 ${className}`}
        style={{ ...style, animationDelay: delay }}
    >
        {/* Card Header Placeholder */}
        <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-white/30"></div>
            <div className="flex-1 h-3 bg-white/20 rounded-full"></div>
        </div>
        {/* Card Body Placeholder */}
        <div className="space-y-2">
            <div className="w-full h-2 bg-white/10 rounded-full"></div>
            <div className="w-5/6 h-2 bg-white/10 rounded-full"></div>
            <div className="w-2/3 h-2 bg-white/10 rounded-full"></div>
        </div>
        {/* Bottom Accent */}
        <div className="mt-auto flex justify-end">
            <div className="w-8 h-2 bg-yellow-400/20 rounded-full"></div>
        </div>
    </div>
);

export const MeshBackground = () => {
    return (
        <div className="mesh-bg-container">
            {/* Mesh Blobs for soft color transitions */}
            <div
                className="mesh-blob w-[800px] h-[800px] -top-64 -left-32"
                style={{ backgroundColor: 'var(--bg-mesh-1)', animationDelay: '0s' }}
            ></div>
            <div
                className="mesh-blob w-[600px] h-[600px] top-1/3 -right-32"
                style={{ backgroundColor: 'var(--bg-mesh-2)', animationDelay: '-5s' }}
            ></div>
            <div
                className="mesh-blob w-[900px] h-[900px] -bottom-48 left-1/3"
                style={{ backgroundColor: 'var(--bg-mesh-3)', animationDelay: '-10s' }}
            ></div>

            {/* Realistic Background Cards matching the image aesthetic - Sharper Version */}
            <BackgroundCard
                className="w-64 h-40 top-[12%] left-[3%] rotate-[18deg]"
                delay="0s"
            />
            <BackgroundCard
                className="w-72 h-44 bottom-[18%] right-[5%] -rotate-[10deg]"
                delay="-4s"
            />
            <BackgroundCard
                className="w-56 h-36 top-[45%] right-[12%] rotate-[35deg]"
                delay="-7s"
            />
            <BackgroundCard
                className="w-80 h-48 bottom-[8%] left-[18%] rotate-[4deg]"
                delay="-11s"
            />
            <BackgroundCard
                className="w-52 h-34 top-[28%] left-[28%] -rotate-[15deg]"
                delay="-2s"
            />
            <BackgroundCard
                className="w-64 h-40 top-[65%] left-[8%] rotate-[12deg]"
                delay="-15s"
            />
            <BackgroundCard
                className="w-60 h-38 top-[8%] right-[25%] -rotate-[6deg]"
                delay="-9s"
            />
        </div>
    );
};
