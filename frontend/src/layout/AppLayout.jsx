import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Navigate, Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import { useState } from "react";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAuthenticated, isLoading } = useSelector(store => store.auth);
  const [isCreatingWorkspace,setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace,setCurrentWorkspace] = useState({});

  if (isLoading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  const handleWorkspaceSelected = (workspace) => {
    setCurrentWorkspace(workspace);
    console.log('workspace : ',workspace);
  }

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader
        onWorkspaceSelected={handleWorkspaceSelected}
        selectedWorkspace={currentWorkspace}
        onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => (
  <SidebarProvider>
    <LayoutContent />
  </SidebarProvider>
);

export default AppLayout;
