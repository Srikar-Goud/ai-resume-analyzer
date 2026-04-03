import React, { useState } from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../constants'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({onFileSelect}: FileUploaderProps) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Handle the accepted files here
        const file = acceptedFiles[0] || null;
        console.log(acceptedFiles);
        onFileSelect?.(file);
    }, [onFileSelect]);
  const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
    onDrop,
    multiple: false,
    accept: {
        'application/pdf': ['.pdf']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
})

const file = acceptedFiles[0] || null;


  return (
    <div className="w-full gradient-border p-1 rounded-lg">
      <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="space-y-4 cursor-pointer">
        <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <img src="/icons/info.svg" alt="Upload Icon" className="size-20" />
        </div>

        {file ? (
            <div className="flex items-center space-x-3">
                <img src="/images/pdf.png" alt="PDF Icon" className="size-10" />
                <div>

                <p className="text-lg font-semibold">
                    {file.name}</p>
                <p className="text-sm text-gray-500">
                    {formatSize(file.size)}</p>
                </div>
            </div>
        ) : (
            <div>
                <p className="text-lg text-gray-500">
                    <span className="font-semibold">Choose a file</span> or drag it here
                </p>
                <p className="text-lg text-gray-500">PDF (max 20MB)</p>
            </div>
        )}

      </div>
    </div>

    </div>
  )
}

export default FileUploader
