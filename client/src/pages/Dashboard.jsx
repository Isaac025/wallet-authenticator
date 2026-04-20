import React from "react";

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Welcome to your Dashboard
        </h1>
        <p className="text-gray-600">
          You are successfully authenticated with your wallet 🎉
        </p>
      </div>
    </div>
  );
}
