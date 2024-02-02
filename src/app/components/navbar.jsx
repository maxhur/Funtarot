import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Tarot App
        </Link>
        <div className="flex space-x-4">
          <Link href="/readings" className="text-white hover:text-gray-300">
            Readings
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300">
            About
          </Link>
          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
};
  