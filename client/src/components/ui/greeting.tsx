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
    <div className="flex flex-col justify-start items-start pt-14">
      <h1 className="text-xl font-medium mb-4 text-gray-200">
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
  );
}
