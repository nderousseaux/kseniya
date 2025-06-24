'use client';

import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import Background from '@/src/components/Background';

interface InfiniteCanvasProps {
  children: React.ReactNode;
}

export default function InfiniteCanvas({ children }: InfiniteCanvasProps) {
  return (
    <Background>
      <TransformWrapper
      panning={{ excluded: ['text-selectable'], velocityDisabled: true }}
      wheel={{ excluded: ['text-selectable'] }}
      pinch={{ excluded: ['text-selectable'] }}
      limitToBounds={false}
      minScale={0.1}
      maxScale={10}
      >
      <TransformComponent>
        <div className="flex items-center justify-center w-screen h-screen">
          {children}
        </div>
      </TransformComponent>
      </TransformWrapper>
    </Background>
  );
}
