import { FaGlobe } from 'react-icons/fa'

function LanguageSelector() {
  return (
    <div className="flex items-center justify-center mt-12">
      <div className="relative w-64">
        <div className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 shadow-md">
          <FaGlobe className="text-gray-500 text-lg" />
          <select
            className="w-full bg-white text-gray-800 focus:outline-none font-medium pr-6"
          >
            <option>Language</option>
            <option>English</option>
            <option>한국어</option>
          </select>
        </div>

        <div className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500">
          ▼
        </div>
      </div>
    </div>
  );
}

export default LanguageSelector