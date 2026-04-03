import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import { resumes } from "../constants";
import ResumeCard from "../components/ResumeCard";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePuterStore } from "~/lib/puter";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeAnalyzer" },
    { name: "description", content: "Smart resume analysis tool!" },
  ];
}

export default function Home() {
    const { auth} = usePuterStore();
    const navigate = useNavigate();


    useEffect(() => {
        if(!auth.isAuthenticated) {
            // Redirect to home page or dashboard after successful login
            navigate('/auth?next=/');
        }
      },
        [auth.isAuthenticated]
    )


  return <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
    <Navbar />
    {/* {window.puter.ai.chat("Hello, how can I help you today?")} */}
    <section className="main-section ">
      <div className="page-heading py-50">
        <h1>Welcome to ResumeAnalyzer </h1>
        <p>Review and analyze your resumes with our smart tool!</p>
      </div>

  {resumes.length > 0 && (
    <div className="resumes-section ">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
      </div>
  )}
  </section>

  </main>;
}
