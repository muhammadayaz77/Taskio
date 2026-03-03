import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useArchivedTask from "../../hooks/task/useArchievedTask";
import useWatchTask from "../../hooks/task/useWatchTask";
import { useSelector } from "react-redux";

function TaskDetailsHeader({
  task,
  title,
}) {
  const navigate = useNavigate();

  // Watch mutation
  const {
    mutate: toggleWatch,
    isPending: watchLoading,
  } = useWatchTask();

  const {user} = useSelector(store => store.auth)

  // Archive mutation
  const {
    mutate: toggleArchive,
    isPending: archiveLoading,
  } = useArchivedTask();

const isWatching = task?.watchers?.some(
  (watcherId) =>
    watcherId?.toString() === user?._id?.toString()
);

  // console.log("watchers : ",user._id.toString());
  const handleWatch = () => {
    // alert(isWatching)
    toggleWatch({ taskId : task?._id })
  }
  const handleArchive = () => {
    toggleArchive({ taskId : task?._id })
  }
  return (
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-white flex items-center gap-1 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={14} />
          Back
        </Button>

        <h1 className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>

        {task?.archieved && (
          <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600">
            Archived
          </span>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* WATCH BUTTON */}
        <Button
          variant="outline"
          disabled={watchLoading}
          onClick={handleWatch}
          className="flex items-center gap-2 cursor-pointer"
        >
          {isWatching ? (
            <>
              <EyeOff className="h-4 w-4" />
              Unwatch
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Watch
            </>
          )}
        </Button>

        {/* ARCHIVE BUTTON */}
        <Button
          variant="secondary"
          // disabled={archiveLoading}
          onClick={handleArchive}
          className="flex items-center gap-2 cursor-pointer"
        >
          {task?.archieved ? (
            <>
              <ArchiveRestore className="h-4 w-4" />
              Unarchive
            </>
          ) : (
            <>
              <Archive className="h-4 w-4" />
              Archive
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default TaskDetailsHeader;