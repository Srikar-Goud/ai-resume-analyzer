import React from 'react'
import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle'

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } } : { resume: Resume }) => {
  return (
    <Link to={`/resumes/${id}`} className="resume-card animate-in fade-in duration-3000">
      <div className="resume-card-header ">
        <div className='flex flex-col gap-2 justify-center'>
          <h2 className="!text-black font-bold break-words">{companyName}</h2>
          <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback?.overallScore ?? 0} />
        </div>
      </div>
      <div className="gradient-border animate-in fade-in duration-3000">
        <div className="w-full h-full">
            <img 
              src={imagePath}
              alt="resume preview"
             className="w-full h-[350px] max-sm:h-[200px] object-top object-cover rounded-lg" 
           />
        </div>
      </div>
    </Link>
  )
} 

export default ResumeCard
