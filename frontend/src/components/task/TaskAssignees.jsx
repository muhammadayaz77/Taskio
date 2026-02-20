import { useState, useEffect } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import useUpdateTaskAssignees from '../../hooks/task/useUpdateTaskAssignees.js'

function TaskAssignees({ taskId, assignees = [], members = [] }) {
  // State stores only IDs
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // final selected IDs
  const [tempIds, setTempIds] = useState([]); // temporary state while dropdown is open
  const {mutate:updateAssignees,isPending} = useUpdateTaskAssignees()

  // Sync final selected state with props (assumes assignees is array of objects)
  useEffect(() => {
    setSelectedIds(assignees.map((a) => a._id));
  }, [assignees]);

  // Open dropdown → copy selectedIds to temp
  const handleDropdownToggle = () => {
    setTempIds(selectedIds);
    setIsOpen((prev) => !prev);
  };

  // Toggle member in temporary state
  const handleToggle = (memberId) => {
    setTempIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Select All
  const handleSelectAll = () => {
    setTempIds(members.map((m) => m.user._id));
  };

  // Unselect All
  const handleUnselectAll = () => {
    setTempIds([]);
  };

  // Cancel → restore tempIds from current selectedIds
  const handleCancel = () => {
    setTempIds(selectedIds);
    setIsOpen(false);
  };

  // Save → commit tempIds to final selectedIds
  const handleSave = () => {
    setSelectedIds(tempIds);
    setIsOpen(false);

    console.log("Saved Assignee IDs:", tempIds);

    // 🔥 Call API here
    updateAssignees({ taskId, assignees: tempIds })
  };

  return (
    <div className="space-y-4 relative">
      {/* Header */}
      <p className="text-sm font-medium">Assignees ({selectedIds.length})</p>

      {/* Selected Badges */}
      <div className="flex flex-wrap gap-2">
        {selectedIds.length === 0 && (
          <p className="text-sm text-muted-foreground">No members assigned</p>
        )}
        {members
          .filter((m) => selectedIds.includes(m.user._id))
          .map((m) => (
            <Badge key={m.user._id} variant="secondary">
              {m.user.name}
            </Badge>
          ))}
      </div>

      {/* Dropdown Button */}
      <Button variant="outline" className="w-full" onClick={handleDropdownToggle}>
        Manage Members
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg p-4 space-y-3">
          {/* Select/Unselect All */}
          <div className="flex justify-between">
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleUnselectAll}>
              Unselect All
            </Button>
          </div>

          {/* Members List */}
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {members.map((member) => {
              const checked = tempIds.includes(member.user._id);
              return (
                <div key={member.user._id} className="flex items-center gap-2">
                  <Checkbox checked={checked} onCheckedChange={() => handleToggle(member.user._id)} />
                  <span className="text-sm">{member.user.name}</span>
                </div>
              );
            })}
          </div>

          {/* Cancel / Save */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskAssignees;
