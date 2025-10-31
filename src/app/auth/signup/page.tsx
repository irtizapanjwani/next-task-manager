"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  const isEmailValid = email === "" || emailRegex.test(email)
  const isPasswordValid = password === "" || passwordRegex.test(password)

  // Password strength checks
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[@$!%*?&]/.test(password)
  const hasMinLength = password.length >= 8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate email format
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    // Validate password strength
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        router.push("/auth/signin?message=Account created successfully")
      } else {
        const data = await res.json()
        setError(data.error || "Something went wrong")
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Sign Up
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`text-black mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${isEmailValid
                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                }`}
            />
            {!isEmailValid && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`text-black mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${isPasswordValid
                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                }`}
            />
            {password !== "" && (
              <div className="mt-1 text-xs">
                <p className="text-gray-600 mb-1">Password requirements:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center ${hasMinLength ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="mr-2">{hasMinLength ? '✓' : '✗'}</span>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="mr-2">{hasUpperCase ? '✓' : '✗'}</span>
                    One uppercase letter (A-Z)
                  </li>
                  <li className={`flex items-center ${hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="mr-2">{hasLowerCase ? '✓' : '✗'}</span>
                    One lowercase letter (a-z)
                  </li>
                  <li className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="mr-2">{hasNumber ? '✓' : '✗'}</span>
                    One number (0-9)
                  </li>
                  <li className={`flex items-center ${hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="mr-2">{hasSpecialChar ? '✓' : '✗'}</span>
                    One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !isEmailValid || !isPasswordValid}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          <div className="text-center">
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}