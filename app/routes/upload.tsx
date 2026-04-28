import React, { useState, type FormEvent } from 'react'
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { formatSize } from '~/constants'

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("Processing your resume...");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const companyName = formData.get("company-name") ;
        const jobTitle = formData.get("job-title");
        const jobDescription = formData.get("job-description");

        if (!file) {
            alert("Please upload a resume to analyze.");
            return;
        }

        console.log({ companyName, jobTitle, jobDescription, file });

        // Add your processing logic here
        setIsProcessing(true);
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading">
                    <h1>Smart feedback for your dream job</h1>

                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full h-auto" alt="Processing..." />
                        </>
                    ) : (
                        <>
                            <h2>Drop your resume here for ATS score and feedback</h2>

                            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-8">
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input
                                        type="text"
                                        id="company-name"
                                        name="company-name"
                                        placeholder="Enter company name"
                                        required
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input
                                        type="text"
                                        id="job-title"
                                        name="job-title"
                                        placeholder="Enter job title"
                                        required
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea
                                        id="job-description"
                                        name="job-description"
                                        placeholder="Paste job description here"
                                        rows={5}
                                        required
                                    />
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

                                <button className="primary-button w-full animate-pulse" type="submit">
                                    Analyze Resume
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Upload