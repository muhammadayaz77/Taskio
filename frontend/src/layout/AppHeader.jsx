import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { useDispatch, useSelector } from "react-redux";
// import { logout } from "@/store/auth/authSlice";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "../components/ui/avatar";

import {
  Bell,
  ChevronDown,
  Layers,
  Plus,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "../../store/auth/authSlice";

// const {workspaces} = useLoaderData();
const AppHeader = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const {workspaces} = useLoaderData()
  console.log('work : ',workspaces)
  
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  
  const handleLogout = () => {
    dispatch(logout())
  }
  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="flex flex-col lg:flex-row lg:px-6">
        {/* LEFT */}
        <div className="flex items-center justify-between w-full px-3 py-3 border-b lg:border-b-0 lg:py-4 lg:px-0">
          <div className="flex items-center gap-2">
            {/* Sidebar Toggle */}
            <button
              className="flex items-center justify-center w-10 h-10 border rounded-lg hover:bg-gray-100"
              onClick={handleToggle}
            >
               {isMobileOpen ? (
              /* Close Icon */
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              /* Hamburger Icon */
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            )}  
            </button>

            {/* WORKSPACE DROPDOWN */}
            <DropdownMenu open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 h-10 border rounded-lg hover:bg-gray-100 transition">
                  <Layers size={16} />
                  <span className="text-sm font-medium">Workspace</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      workspaceOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                {
                  workspaces.map(ws => <>
                  
                    <DropdownMenuItem
                    key={ws._id}
                     onClick={() => onWorkspaceSelected(ws)}
                     >
                      {ws?.color && (
                        <WorkspaceAvatar color={ws.color} name={ws.name} />
                    )}
                    <span>{ws?.name}</span>
                      </DropdownMenuItem>
                      </>
                  )
                }

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={onCreateWorkspace}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Logo Mobile */}
          <Link to="/" className="lg:hidden">
            <img src="/Logo.png" width={30} height={30} alt="Logo" />
          </Link>

          {/* Mobile Menu */}
          <button
            onClick={toggleApplicationMenu}
            className="lg:hidden w-10 h-10 rounded-lg hover:bg-gray-100"
          >
            ⋮
          </button>
        </div>

        {/* RIGHT */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } lg:flex items-center justify-end gap-3 px-5 py-4 lg:px-0`}
        >
          {/* NOTIFICATION DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative px-3 h-10 border rounded-lg hover:bg-gray-100">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* USER DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 h-10 border rounded-lg hover:bg-gray-100">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium">
                  {user?.name}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem className='cursor-pointer'>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className='cursor-pointer'>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
