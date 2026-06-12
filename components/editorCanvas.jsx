

"use client";

import { forwardRef } from "react";

const EditorCanvas = forwardRef(({}, ref) => {
  return (
    <div
      className="
        w-full
        h-full
        flex
        items-center
        justify-center
        p-4
        sm:p-8
      "
    >
      <div
        className="
          relative
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-3xl
          p-4
          sm:p-6
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]
          overflow-hidden
        "
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C8FF00]/10 blur-[100px] pointer-events-none" />

        {/* Canvas Wrapper */}
        <div
          className="
            relative
            z-10
            bg-white
            rounded-2xl
            overflow-hidden
            shadow-[0_10px_40px_rgba(0,0,0,0.5)]
          "
        >
          <canvas
            ref={ref}
            width="1000"
            height="500"
            className="
              max-w-full
              h-auto
              block
            "
          />
        </div>
      </div>
    </div>
  );
});

EditorCanvas.displayName = "EditorCanvas";

export default EditorCanvas;