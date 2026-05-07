import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Chat Draw!</h1>
      <p className="text-lg text-gray-300">Start chatting and drawing with your friends.</p>
      <Link to='/room'>Play</Link>
    </div>
  );
};
