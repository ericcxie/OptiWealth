import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

interface GreetingProps {
  name: string;
  portfolioValue: number | null;
  loading: boolean;
}

export default function Greeting({
  name,
  portfolioValue,
  loading,
}: GreetingProps) {
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex-1 flex flex-col justify-start items-start pt-14 pl-80 pr-12">
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-5 rounded-3xl w-full shadow-md inline-block">
        <h1 className="text-2xl font-medium mb-2 text-gray-100">
          {getGreeting()} {name}. You have
        </h1>
        <h2 className="text-4xl font-bold">
          {loading ? (
            <div>
              <PulseLoader color="#FFFFFF" size={12} />
            </div>
          ) : portfolioValue ? (
            <>
              $
              {portfolioValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </>
          ) : (
            "$0.00"
          )}
        </h2>
      </div>
    </div>
  );
}
