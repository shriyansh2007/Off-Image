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
        const fabricCanvas = new Canvas(canvasRef.current, { backgroundColor: 'white' });
        fabricCanvas.setDimensions({ width: 1000, height: 500 });
        setCanvas(fabricCanvas);
        console.log("canvas created", fabricCanvas);


        return () => fabricCanvas.dispose();


    }, [canvasRef, setCanvas]);
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
        <div className="editor">
            <Toolbox canvas={canvas} project={project} />
            <EditorCanvas ref={canvasRef} canvas={canvas} />
        </div>
    );
}
export default Editor;