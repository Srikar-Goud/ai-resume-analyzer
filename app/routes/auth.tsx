import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePuterStore } from '~/lib/puter'
export const meta = () => ([
    {title : "Auth | ResumeAnalyzer"},
    {name: "description", content: "Login to your ResumeAnalyzer account"}
])

const auth = () => {
    const { isLoading, auth} = usePuterStore();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const next = params.get("next") || "/";
    const navigate = useNavigate();

console.log("Auth state:", auth);

    useEffect(() => {
        if(auth.isAuthenticated) {
            // Redirect to home page or dashboard after successful login
            navigate(next);
        }
    },
        [auth.isAuthenticated, navigate, next]
    )

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover bg-center min-h-screen flex items-center justify-center">
        <div className="gradient-border shadow-lg">
            <div className="bg-white p-8 rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Login to ResumeAnalyzer</h1>
                <p className="text-gray-600 mb-6 flex w-fit justify-center">Please enter your credentials to access your account.</p>
                {/* Login form would go here */}
                {isLoading ? (
                    <button className="auth-button animate-pulse">
                        <p>Signing you in...</p>
                    </button>
                ) : (
                    <>
                    {auth.isAuthenticated ? (
                        <button className="auth-button" onClick={auth.signOut}>
                            <p>Log Out</p>
                        </button>
                    ) : (
                        <button className="auth-button" onClick={auth.signIn}>
                            <p>Log In</p>
                        </button>
                    )}
                    </>
                )}
            </div>
        </div>
    </main>
  )
}

export default auth
