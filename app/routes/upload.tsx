import React, { useState, type FormEvent } from 'react'
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { formatSize, prepareInstructions } from '~/constants'
import { usePuterStore } from '~/lib/puter';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateUUID } from '~/lib/utils';
import { convertPdfToImage } from '~/lib/pdf2img';

const Upload = () => {
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated) {
            // Redirect to home page or dashboard after successful login
            navigate('/auth?next=/upload');
        }
    }, [auth.isAuthenticated, navigate]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("Processing your resume...");
    const [file, setFile] = useState<File | null>(null);

    // Controlled state for form fields
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string; jobTitle: string; jobDescription: string; file: File }) => {
        setIsProcessing(true);
        setStatusText("Analyzing your resume with AI...");
        const uploadedFile = await fs.upload([file])
        if(!uploadedFile) return setStatusText("Failed to upload file. Please try again.");

        setStatusText("File uploaded. Converting to image...");
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText("Failed to convert PDF to image. Please try again.");

        setStatusText("Uploading the imaqge...");
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText("Failed to upload image file. Please try again.");

        setStatusText("Getting feedback ...");

        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Feedback received. Redirecting to results page...");

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if(!feedback) return setStatusText("Failed to get feedback from AI. Please try again.");

       const feedbackText = typeof feedback.message.content === "string" ? feedback.message.content : feedback.message.content[0].text || "No feedback received";

       data.feedback = JSON.parse(feedbackText);
       await kv.set(`resume:${uuid}`, JSON.stringify(data));
       setStatusText("Analysis complete! Redirecting to results page...");
       console.log("Final data stored in KV:", data);
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            alert("Please upload a resume to analyze.");
            return;
        }

        console.log({ companyName, jobTitle, jobDescription, file });
        if(!file) return;


        handleAnalyze({ companyName, jobTitle, jobDescription, file });

        
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
                                        placeholder="Enter company name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input
                                        type="text"
                                        id="job-title"
                                        placeholder="Enter job title"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea
                                        id="job-description"
                                        placeholder="Paste job description here"
                                        rows={5}
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
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