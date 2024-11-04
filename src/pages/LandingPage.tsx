import { Link } from 'react-router-dom';
import { QrCode, BarChart3, Palette, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-white text-2xl font-bold flex items-center gap-2">
            <QrCode className="h-8 w-8" />
            QR Studio
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-white hover:text-indigo-200">Login</Link>
            <Link to="/signup" className="bg-white text-indigo-900 px-4 py-2 rounded-lg hover:bg-indigo-100">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6">
            Create Dynamic QR Experiences
          </h1>
          <p className="text-xl mb-12 text-indigo-200">
            Design beautiful landing pages for your QR codes with real-time preview and analytics
          </p>
          <Link
            to="/signup"
            className="bg-white text-indigo-900 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-indigo-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: <Palette className="h-12 w-12" />,
              title: "Custom Design",
              description: "Create unique landing pages with our drag-and-drop editor"
            },
            {
              icon: <BarChart3 className="h-12 w-12" />,
              title: "Analytics",
              description: "Track scans and user engagement in real-time"
            },
            {
              icon: <Shield className="h-12 w-12" />,
              title: "Secure",
              description: "Enterprise-grade security for your QR campaigns"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-indigo-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}