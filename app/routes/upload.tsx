import React, { useState, type FormEvent } from 'react'
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { usePuterStore } from '~/lib/puter'
import { formatSize } from '~/constants'


const upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("Processing your resume...");
    const [file, setfile] = useState<File | null>(null);
    const handleFileSelect = (file: File) => {
        console.log("Selected file:", file);
        setfile(file);
        // You can add additional logic here to handle the selected file
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

    }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
    <Navbar />
    {/* {window.puter.ai.chat("Hello, how can I help you today?")} */}
    <section className="main-section ">
      <div className="page-heading">
        <h1>Smart feedback for your dream job</h1>
        {isProcessing ? (
            <>
            <h2>{statusText}</h2>
            <img src="/images/ressume-scan.gif" className="w-full h-auto" alt="Processing..." />
            </>
            ) : (
                <h2>Drop your resume here for ATS score and feedback</h2>
        )}
        {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-8">
                <div className="form-div">
                    <label htmlFor="company-name">Company Name</label>
                    <input type="text" id="company-name" placeholder="Enter company name" />
                </div>
                <div className="form-div">
                    <label htmlFor="job-title">Job Title</label>
                    <input type="text" id="job-title" placeholder="Enter job title" />
                </div>
                <div className="form-div">
                    <label htmlFor="job-description">Job Description</label>
                    <textarea id="job-description" placeholder="Paste job description here" rows={5} />
                </div>
                <div className="form-div">
                    <label htmlFor="uploader">Upload Resume</label>
                    <FileUploader onFileSelect={handleFileSelect} />
                </div>

                {file && (
                  <div className="rounded-lg bg-white/80 p-4 text-left mt-4 w-full">
                    <p className="font-semibold">Uploaded file:</p>
                    <p>{file.name}</p>
                    <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                  </div>
                )}

                <button className="primary-button w-full" type="submit">
                    Analyze Resume
                </button>
            </form>
        )}
      </div>
    </section>
  </main>
  )
}

export default upload
