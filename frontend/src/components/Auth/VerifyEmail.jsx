import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import useVerifyEmail from "../../hooks/auth/useVerifyEmail";

function VerifyEmail() {
  const {token} = useParams();
  const [isSuccess, setIsSuccess] = useState(false); // true/false after verification
  const {mutate,isPending:isVerifying} = useVerifyEmail();  
  useEffect(() => {
    console.log("token:", token);

      if (!token) {
        setIsSuccess(false);
      } else {
        mutate({
          token
        },{
          onSuccess : () => {
            setIsSuccess(true)
          }
        },
        {
          onError : (err) => {
            setIsSuccess(false)
          }
        }
      )
      }

  }, [token]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        {isVerifying ? (
          // Loader while verifying
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">Verifying your email...</p>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <CheckCircle className="text-green-500" size={48} />
              ) : (
                <XCircle className="text-red-500" size={48} />
              )}
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {isSuccess ? "Email Verified!" : "Verification Failed"}
            </h1>

            {/* Message */}
            <p className="text-sm text-gray-500 mb-6">
              {isSuccess
                ? "Your email has been successfully verified."
                : "Invalid or expired verification link."}
            </p>

            {/* Back Button */}
            {isSuccess ? (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
              >
                <ArrowLeft size={16} /> Back to Login
              </Link>
            ) : (
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
              >
                <ArrowLeft size={16} /> Back to Signup
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
