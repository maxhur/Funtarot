import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-white text-xl font-bold">Tarot App</a>
        </Link>
        <div className="flex space-x-4">
          <Link href="/readings">
            <a className="text-white hover:text-gray-300">Readings</a>
          </Link>
          <Link href="/about">
            <a className="text-white hover:text-gray-300">About</a>
          </Link>
          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
};
  