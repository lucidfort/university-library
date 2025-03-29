'use client'

import Image from "next/image";
import { useRef, useState } from "react";

import config from "@/lib/config";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import { toast } from "sonner";


const {
    env: {
        imageKit: { publicKey, urlEndpoint },
        apiEndpoint,
    },
} = config;

const authenticator = async () => {
    try {
        const response = await fetch(`${apiEndpoint}/api/auth/imageKit`)

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(`Request failed with status ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        const { signature, expire, token } = data

        return { signature, expire, token }
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`)
    }
}

const ImageUpload = ({ onFileChange }: { onFileChange: (filePath: string) => void }) => {
    const ikUploadRef = useRef(null)
    const [isUploading, setIsUploading] = useState(false)
    const [file, setFile] = useState<{ filePath: string } | null>(null)

    const onError = (error: any) => {
        console.log(error)
        setIsUploading(false)

        toast.warning("Image upload failed. Please try again")
    }

    const onSuccess = (res: any) => {
        setIsUploading(false)
        setFile(res)
        onFileChange(res.filePath)

        toast.message("Image uploaded successfully", {
            description: `${res.filePath} uploaded!!`
        })
    }

    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <IKUpload
                className="hidden"
                ref={ikUploadRef}
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={() => setIsUploading(true)}
                fileName="test-upload.png"
            />

            <button
                className="upload-btn"
                onClick={(e) => {
                    e.preventDefault()

                    if (ikUploadRef.current) {
                        // @ts-ignore
                        ikUploadRef.current?.click()
                    }
                }}
            >
                <Image src="/icons/upload.svg" alt="upload-icon" width={20} height={20} className="object-contain" />
                <p className="text-base text-light-100">{isUploading ? "Uploading..." : "Upload a file"}</p>

                {file && <p className="upload-filename">{file.filePath}</p>}
            </button>

            {file && <IKImage
                path={file.filePath}
                alt={file.filePath}
                width={500}
                height={300}
            />}
        </ImageKitProvider>
    )
}

export default ImageUpload