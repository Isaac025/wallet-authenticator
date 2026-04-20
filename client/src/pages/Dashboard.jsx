import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-2 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500" />

          <div className="px-8 py-10 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-5xl">🎉</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Welcome back!
            </h1>

            <p className="text-xl text-green-700 font-semibold mb-2">
              You've successfully connected
            </p>

            {/* Wallet Status */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-2xl text-sm font-medium mb-8">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              Wallet Authenticated
            </div>

            {/* Main Message */}
            <p className="text-gray-600 leading-relaxed text-lg mb-10">
              You're now signed in with your wallet. Explore your personalized
              dashboard and enjoy seamless access.
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-green-600 hover:bg-green-700 transition-all text-white font-semibold py-4 px-6 rounded-2xl text-lg shadow-lg shadow-green-200 active:scale-95">
                Go to Dashboard
              </button>

              <button className="w-full border border-gray-300 hover:border-gray-400 transition-all font-medium py-4 px-6 rounded-2xl text-gray-700 hover:text-gray-900">
                View Wallet Details
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="border-t border-gray-100 px-8 py-6 bg-gray-50 text-center">
            <p className="text-xs text-gray-500">
              Secured by Wallet Authentication • Last login: Just now
            </p>
          </div>
        </div>

        {/* Subtle Trust Indicators */}
        <div className="flex justify-center gap-6 mt-8 text-gray-400">
          <div className="flex items-center gap-1.5 text-xs">
            <span>🔒</span>
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span>⚡</span>
            <span>Instant</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span>🌐</span>
            <span>Web3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
