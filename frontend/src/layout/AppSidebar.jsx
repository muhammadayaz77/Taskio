import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
// import { GridIcon, ChevronDownIcon, HorizontaLDots } from "../icons";

import { Grid as GridIcon, ChevronDown as ChevronDownIcon, MoreHorizontal as HorizontaLDots } from "lucide-react";
import {  UserCog as User } from "lucide-react";

import { Store, CheckSquare, Users, Settings, Archive, Folder, Clipboard } from "lucide-react";

const navItems = [
  {
    icon: <Folder />,
    name: "Workspaces",
    path: "/workspaces",
  },
  {
    icon: <Clipboard />,
    name: "My Tasks",
    path: "/my-tasks",
  },
  {
    icon: <Users />,
    name: "Members",
    path: "/members",
  },
  {
    icon: <CheckSquare />,
    name: "Achieved",
    path: "/achieved",
  },
  {
    icon: <Settings />,
    name: "Settings",
    path: "/settings",
  },
];

import { useSidebar } from "../context/SidebarContext";


const adminNavItems = [
  {
    icon: <GridIcon />,
    name: "User Management",
    subItems: [
      { name: "Admins", path: "/admin/", pro: false },
      { name: "Sellers", path: "/admin/users/seller", pro: false },
      { name: "Approved Sellers", path: "/admin/users/seller/approve", pro: false },
      { name: "Customers", path: "/customer/", pro: false },
    ],
  },
];



const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  // 👇 You can change this dynamically later (e.g., from localStorage)
  // const [role] = useState("seller");

  // const navItems = role === "admin" ? adminNavItems : role === 'seller' ? navItems : [];

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(index);
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  return (
    <aside
      className={`fixed mt-16 lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen border-r border-gray-200 transition-all duration-300 z-50 
    ${
      isExpanded || isMobileOpen
        ? "w-[290px]"
        : isHovered
        ? "w-[290px]"
        : "w-[90px]"
    }
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 overflow-x-hidden`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <img src="/Logo.png" alt="Logo" width={50} height={40} />
              <span className="text-gray-900 text-2xl font-semibold">
                Taskio
              </span>
            </div>
          ) : (
            <img src="/Logo.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto overflow-x-hidden duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {/* Section Title */}
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Dashboard"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>

              <ul className="flex flex-col gap-4">
                {navItems.map((nav, index) => (
                  <li key={nav.name}>
                    {nav.subItems ? (
                      <button
                        onClick={() => handleSubmenuToggle(index)}
                        className={`flex items-center justify-center w-full gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                          ${
                            openSubmenu === index
                              ? "bg-gray-100 text-black"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                          ${
                            !isExpanded && !isHovered
                              ? "lg:justify-center"
                              : "lg:justify-start"
                          }`}
                      >
                        <span className="w-4 h-4">{nav.icon}</span>
                        {(isExpanded || isHovered || isMobileOpen) && (
                          <span className="text-sm font-medium whitespace-nowrap">
                            {nav.name}
                          </span>
                        )}
                        {(isExpanded || isHovered || isMobileOpen) && (
                          <ChevronDownIcon
                            className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                              openSubmenu === index
                                ? "rotate-180 text-black"
                                : "text-gray-500"
                            }`}
                          />
                        )}
                      </button>
                    ) : (
                      nav.path && (
                        <Link
                          to={nav.path}
                          className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                            ${
                              isActive(nav.path)
                                ? "bg-gray-100 text-black"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          <span className="w-4 h-4">{nav.icon}</span>
                          {(isExpanded || isHovered || isMobileOpen) && (
                            <span className="text-sm font-medium whitespace-nowrap">
                              {nav.name}
                            </span>
                          )}
                        </Link>
                      )
                    )}

                    {/* Submenu */}
                    {nav.subItems &&
                      (isExpanded || isHovered || isMobileOpen) && (
                        <div
                          ref={(el) => {
                            subMenuRefs.current[`main-${index}`] = el;
                          }}
                          className="overflow-hidden transition-all duration-300"
                          style={{
                            height:
                              openSubmenu === index
                                ? `${subMenuHeight[`main-${index}`]}px`
                                : "0px",
                          }}
                        >
                          <ul className="mt-2 space-y-1 ml-9">
                            {nav.subItems.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  to={subItem.path}
                                  className={`block px-3 py-1.5 rounded-md text-sm transition-colors duration-200 whitespace-nowrap
                                  ${
                                    isActive(subItem.path)
                                      ? "bg-gray-200 text-black font-medium"
                                      : "text-gray-600 hover:text-black hover:bg-gray-100"
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
