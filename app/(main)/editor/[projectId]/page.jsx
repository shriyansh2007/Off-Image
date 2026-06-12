"use client";
import react from 'react';
import Toolbox from '@/components/Toolbox';
import EditorCanvas from '@/components/editorCanvas';
import '@/components/Toolbox.css';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Canvas } from 'fabric';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FabricImage } from 'fabric';
const Editor = () => {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const { projectId } = useParams();
    const project = useQuery(
        api.projects.getProject,
        { projectId }
    );
    useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
        backgroundColor: "white",
    });

    fabricCanvas.setDimensions({
        width: 1000,
        height: 500,
    });

    setCanvas(fabricCanvas);

    return () => {
        try {
            fabricCanvas.dispose();
        } catch (err) {
            console.error("Canvas cleanup error:", err);
        }
    };
}, []);
    useEffect(() => {
        if (!canvas) return;

        if (!project?.originalImageUrl) return;

        const loadImage = async () => {
            const img = await FabricImage.fromURL(
                project.originalImageUrl,
                { crossOrigin: 'anonymous' }
            );

            canvas.clear();
            canvas.add(img);
            canvas.renderAll();
        };

        loadImage();
    }, [canvas, project]);

    useEffect(() => {
        if (!canvas) return;

        const handleKeyDown = (e) => {
            if (e.key !== 'Delete' && e.key !== 'Backspace') return;

            const activeObjects = canvas.getActiveObjects();
            if (!activeObjects.length) return;

            activeObjects.forEach((obj) => canvas.remove(obj));
            canvas.discardActiveObject();
            canvas.requestRenderAll();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [canvas]);

    // console.log(project);
    console.log("Project:", project);

    return (
        <div className="relative h-screen overflow-hidden bg-[#080808]">

            {/* Ambient Glows */}
            <div className="absolute top-20 left-[-250px] h-[500px] w-[500px] rounded-full bg-[#C8FF00]/10 blur-[220px]" />

            <div className="absolute bottom-0 right-[-250px] h-[500px] w-[500px] rounded-full bg-[#8B5CF6]/10 blur-[250px]" />

            {/* Main Layout */}
            <div className="relative z-10 flex h-full flex-col lg:flex-row">

                {/* Sidebar */}
                <aside
                    className="
          lg:w-[320px]
          w-full
          lg:h-full
          border-b
          lg:border-b-0
          lg:border-r
          border-white/10
          bg-white/[0.03]
          backdrop-blur-3xl
          overflow-y-auto
        "
                >
                    <div className="p-5">
                        {/* Project Info */}
                        <div
                            className="
              mb-5
              rounded-3xl
              border
              border-white/10
              bg-white/[0.04]
              backdrop-blur-2xl
              p-5
            "
                        >
                            <p className="text-xs uppercase tracking-widest text-[#C8FF00] mb-2">
                                OffImage
                            </p>

                            <h2
                                className="text-xl font-bold text-white line-clamp-1"
                                style={{ fontFamily: "var(--font-syne)" }}
                            >
                                {project?.name || "Untitled Project"}
                            </h2>

                            <p className="text-sm text-white/50 mt-2">
                                AI Powered Editor
                            </p>
                        </div>

                        <Toolbox canvas={canvas} project={project} />
                    </div>
                </aside>

                {/* Canvas Area */}
                <main className="flex-1 flex flex-col">

                    {/* Top Bar */}
                    <div
                        className="
            h-16
            border-b
            border-white/10
            bg-white/[0.03]
            backdrop-blur-3xl
            flex
            items-center
            justify-between
            px-4
            sm:px-6
          "
                    >
                        <div>
                            <h1 className="text-white font-semibold">
                                {project?.name || "Loading..."}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-[#C8FF00]" />

                            <span className="text-sm text-white/60">
                                Ready
                            </span>
                        </div>
                    </div>

                    {/* Canvas Workspace */}
                    <div
                        className="
            flex-1
            p-4
            sm:p-8
            overflow-auto
          "
                    >
                        <div
                            className="
              h-full
              w-full
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.02]
              backdrop-blur-xl
              flex
              items-center
              justify-center
              relative
              overflow-hidden
            "
                        >
                            {/* Grid Background */}
                            <div
                                className="
                absolute
                inset-0
                opacity-[0.03]
              "
                                style={{
                                    backgroundImage:
                                        "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                                    backgroundSize: "24px 24px",
                                }}
                            />

                            {/* Canvas Container */}
                            <div
                                className="
                relative
                z-10
                rounded-2xl
                shadow-[0_20px_80px_rgba(0,0,0,0.6)]
              "
                            >
                                <EditorCanvas
                                    ref={canvasRef}
                                    canvas={canvas}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
export default Editor;