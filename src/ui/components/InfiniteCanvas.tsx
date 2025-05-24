'use client';

import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface InfiniteCanvasProps {
  children: React.ReactNode;
}

export default function InfiniteCanvas({ children }: InfiniteCanvasProps) {
  return (
    <div
      className="w-screen h-screen overflow-hidden bg-[#fafafa] [background-image:radial-gradient(circle,#bbb_1px,transparent_1.5px),radial-gradient(circle,#eee_1px,transparent_1.5px)] [background-size:20px_20px] [background-position:0_0,10px_10px]"
    >
      <TransformWrapper
      panning={{ excluded: ['text-selectable'], velocityDisabled: true }}
      wheel={{ excluded: ['text-selectable'] }}
      pinch={{ excluded: ['text-selectable'] }}
      limitToBounds={false}
      minScale={0.7}
      maxScale={10}
      >
      <TransformComponent>
        <div className="flex items-center justify-center w-screen h-screen">`
        {children}
        </div>
      </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
