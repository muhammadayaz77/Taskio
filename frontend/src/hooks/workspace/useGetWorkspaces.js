import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchData } from "../../api/axios";
import { setWorkspaces } from "../../../store/auth/workspaceSlice";

const useGetWorkspaces = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const [workspaces] = await Promise.all([
          fetchData("/workspaces"),
        ]);
        console.log('workssss : ',workspaces);
        dispatch(setWorkspaces(workspaces));
      } catch (error) {
        console.error("App init failed:", error);
      }
    };

    init();
  }, [dispatch]);
};

export default useGetWorkspaces;
