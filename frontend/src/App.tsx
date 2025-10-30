import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000");
        const data = await response.text();
        setMessage(data);
      } catch {
        setMessage("Failed to fetch data from backend");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Frontend + Backend Test</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
