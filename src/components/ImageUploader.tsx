import { useDropzone } from "react-dropzone";
import { useState } from "react";

type ImageUploaderProps = {
    onUploadComplete: (files: File[]) => void; // Cambiado a devolver archivos, no URLs
};

type ImageItem = {
    file: File;
    preview: string;
};

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
    const [images, setImages] = useState<ImageItem[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...newImages]);

        // Devolvemos los archivos seleccionados al formulario
        if (onUploadComplete) {
            onUploadComplete(acceptedFiles);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className="border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer"
            >
                <input {...getInputProps()} />
                <p>Arrastra imágenes aquí o haz clic para subir</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                            src={image.preview}
                            alt={`Preview ${index}`}
                            className="w-full h-32 object-cover rounded-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
