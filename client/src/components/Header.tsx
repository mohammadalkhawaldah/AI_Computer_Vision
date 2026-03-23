import { Menu, X, BookOpen, LayoutDashboard, PlayCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface HeaderProps {
  platformName: string;
  onMenuToggle?: () => void;
}

export default function Header({ platformName, onMenuToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  const goTo = (path: string) => {
    setLocation(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => goTo("/")}
              className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              <BookOpen className="w-6 h-6 text-white" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">{platformName}</h1>
              <p className="text-xs text-gray-500">Python, backend, and computer vision labs</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => goTo("/lesson")}
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              Classroom
            </button>
            <button
              onClick={() => goTo("/dashboard")}
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              Progress
            </button>
            <button
              onClick={() => goTo("/")}
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              Course Home
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => goTo("/dashboard")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => goTo("/lesson")}
              className="hidden sm:flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:shadow-lg transition-all hover:from-red-700 hover:to-red-800"
            >
              <PlayCircle className="w-4 h-4" />
              Open Classroom
            </button>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <button
              onClick={() => goTo("/lesson")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Classroom
            </button>
            <button
              onClick={() => goTo("/dashboard")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Progress
            </button>
            <button
              onClick={() => goTo("/")}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Course Home
            </button>
            <button
              onClick={() => goTo("/lesson")}
              className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:shadow-lg transition-all"
            >
              Open Classroom
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
