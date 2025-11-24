import { useState } from 'react';
import PersonalInfoIcon from '../assets/Svgs/personalInfo.svg';
import PaymentIcon from '../assets/Svgs/payment.svg';
import EmailIcon from '../assets/Svgs/email.svg';
import SecurityIcon from '../assets/Svgs/security.svg';
import EditIcon from '../assets/Svgs/edit.svg';
import VerifiedIcon from '../assets/Svgs/verified.svg';
import ProfilePhoto from '../assets/imges/photoProfil.jpg';

const AccountSettings = () => {
  const [activeSection, setActiveSection] = useState('personal-info');

  const menuItems = [
    { id: 'personal-info', label: 'Personal Info', icon: PersonalInfoIcon },
    { id: 'payment-methods', label: 'Payment Methods', icon: PaymentIcon },
    { id: 'email-preferences', label: 'Email preferences', icon: EmailIcon },
    { id: 'login-security', label: 'Login & security', icon: SecurityIcon },
  ];

  return (
    <div className="w-full">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-black mb-6">Personal Info</h1>
      <p className="text-sm text-[#4F4F4F] mb-8">Verify your personal info to enhance your experience.</p>

      {/* Main Grid: Left Menu + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left Column: Navigation Menu */}
        <div className="bg-white rounded-xl border border-[#EEEEEE] p-4">
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-[#FFF4F3] text-[#FF4000]'
                        : 'text-[#4F4F4F] hover:bg-[#F8F8F8]'
                    }`}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-5 h-5 shrink-0"
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right Column: Content */}
        <div className="space-y-6">
          {/* Personal Info Section */}
          {activeSection === 'personal-info' && (
            <>
              {/* Profile Card */}
              <div className="bg-white rounded-xl border border-[#EEEEEE] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-black">Profile</h2>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black hover:bg-[#F8F8F8] rounded-lg transition-colors">
                    <img src={EditIcon} alt="Edit" className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={ProfilePhoto}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-black">Lina Bensalem</h3>
                    <p className="text-sm text-[#4F4F4F]">lina.bensalem@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-xl border border-[#EEEEEE] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-black">Email</h2>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black hover:bg-[#F8F8F8] rounded-lg transition-colors">
                    <img src={EditIcon} alt="Edit" className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-sm text-black">sophia.reed@gmail.com</p>
                  <div className="flex items-center gap-1 px-2 py-1 bg-[#E8F5E9] rounded-full">
                    <img src={VerifiedIcon} alt="Verified" className="w-3 h-3" />
                    <span className="text-xs font-medium text-[#2E7D32]">Verified</span>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-xl border border-[#EEEEEE] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-black">Phone</h2>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black hover:bg-[#F8F8F8] rounded-lg transition-colors">
                    <img src={EditIcon} alt="Edit" className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm text-black">(775) 586-5206</p>
                  <button className="text-sm font-medium text-[#FF4000] hover:underline">
                    Verify your phone
                  </button>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-xl border border-[#EEEEEE] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-black">Location</h2>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black hover:bg-[#F8F8F8] rounded-lg transition-colors">
                    <img src={EditIcon} alt="Edit" className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <p className="text-sm text-black">Oran, Algeria</p>
              </div>
            </>
          )}

          {/* Payment Methods Section */}
          {activeSection === 'payment-methods' && (
            <div className="bg-white rounded-xl border border-[#EEEEEE] p-6">
              <h2 className="text-lg font-bold text-black mb-4">Payment Methods</h2>
              <p className="text-sm text-[#4F4F4F]">Manage your payment methods here.</p>
            </div>
          )}

          {/* Email Preferences Section */}
          {activeSection === 'email-preferences' && (
            <div className="bg-white rounded-xl border border-[#EEEEEE] p-6">
              <h2 className="text-lg font-bold text-black mb-4">Email Preferences</h2>
              <p className="text-sm text-[#4F4F4F]">Manage your email notification preferences.</p>
            </div>
          )}

          {/* Login & Security Section */}
          {activeSection === 'login-security' && (
            <div className="bg-white rounded-xl border border-[#EEEEEE] p-6">
              <h2 className="text-lg font-bold text-black mb-4">Login & Security</h2>
              <p className="text-sm text-[#4F4F4F]">Manage your login credentials and security settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
