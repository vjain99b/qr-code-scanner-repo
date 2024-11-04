import { NavLink } from 'react-router-dom';
import { LayoutDashboard, QrCode, PlusSquare, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'QR Codes', href: '/qr-codes', icon: QrCode },
  { name: 'Generate QR', href: '/generate', icon: PlusSquare },
];

export default function Sidebar() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="flex flex-col w-64 bg-indigo-900 text-white">
      <div className="flex items-center gap-2 px-6 py-4">
        <QrCode className="h-8 w-8" />
        <span className="text-xl font-bold">QR Studio</span>
      </div>

      <nav className="flex-1 px-4 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-800'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-8 py-4 text-indigo-100 hover:bg-indigo-800 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </div>
  );
}