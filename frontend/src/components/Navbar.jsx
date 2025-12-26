import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

// Navbar Component
const ProfessionalNavbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items data
  const navItems = [
    {    
      id: 2,
      label: 'Projects',
      icon: <span>📁</span>,
      dropdownItems: [
        { label: 'All Projects', href: '#' },
        { label: 'Active Projects', href: '#' },
        { label: 'Completed Projects', href: '#' },
        { label: 'Create New', href: '#' },
      ],
    },
    {
      id: 3,
      label: 'Tasks',
      icon: <span>✓</span>,
      dropdownItems: [
        { label: 'My Tasks', href: '#' },
        { label: 'Assigned', href: '#' },
        { label: 'Overdue', href: '#' },
        { label: 'Completed', href: '#' },
      ],
    },
    {
      id: 4,
      label: 'Team',
      icon: <span>👥</span>,
      dropdownItems: [
        { label: 'Members', href: '#' },
        { label: 'Roles', href: '#' },
        { label: 'Performance', href: '#' },
      ],
    },
    {
      id: 5,
      label: 'Calendar',
      icon: <span>📅</span>,
      href: '#',
    },
    {
      id: 6,
      label: 'Reports',
      icon: <span>📈</span>,
      dropdownItems: [
        { label: 'Project Reports', href: '#' },
        { label: 'Time Tracking', href: '#' },
        { label: 'Budget Reports', href: '#' },
      ],
    },
    {
      id: 7,
      label: 'Files',
      icon: <span>📎</span>,
      dropdownItems: [
        { label: 'All Files', href: '#' },
        { label: 'Shared', href: '#' },
        { label: 'Recent', href: '#' },
      ],
    },
    {
      id: 8,
      label: 'Settings',
      icon: <span>⚙️</span>,
      dropdownItems: [
        { label: 'Account', href: '#' },
        { label: 'Notifications', href: '#' },
        { label: 'Integrations', href: '#' },
        { label: 'Workspace', href: '#' },
      ],
    },
  ];

  const handleDropdownToggle = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Brand */}
          <div className="flex items-center space-x-8">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradi bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className=" ">
                Taskio
              </span>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  {item.dropdownItems ? (
                    <div className="relative">
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            openDropdown === item.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transition-all duration-300 ${
                          openDropdown === item.id
                            ? 'opacity-100 translate-y-0 visible'
                            : 'opacity-0 -translate-y-2 invisible'
                        }`}
                      >
                        {item.dropdownItems.map((dropdownItem, index) => (
                          <a
                            key={index}
                            href={dropdownItem.href}
                            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 mx-2 rounded-lg"
                          >
                            {dropdownItem.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    >
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - CTA Buttons */}
          <div className="flex items-center space-x-4">
            {/* Contact Sales */}
            <button className="hidden md:flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <span className="font-medium">Contact Sales</span>
            </button>

            {/* Login */}
            <button className="hidden md:flex items-center px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors duration-200">
              Login
            </button>

            {/* Sign Up */}
            <button className="px-5 py-2 bg-black hover:bg-gray-900 text-white rounded-lg font-medium transition-colors duration-200 shadow-md text-nowrap">
              Sign Up
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <div key={item.id} className="mb-1">
                {item.dropdownItems ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          openDropdown === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openDropdown === item.id ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="pl-8 pr-4 py-2 space-y-1">
                        {item.dropdownItems.map((dropdownItem, index) => (
                          <a
                            key={index}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          >
                            {dropdownItem.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </a>
                )}
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <button className="w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200 text-nowrap">
                Contact Sales
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors duration-200">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProfessionalNavbar;