import React from 'react'

 const colorOptions = [
  "#3B82F6", // Blue
  "#14B8A6", // Teal
  "#6366F1", // Indigo
  "#22C55E", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#8B5CF6", // Violet
];


function CreateWorkspace() {
  return (
    <div>
      <span>Muhammad</span>
      {
        colorOptions.map(item => {
          <div className={`bg-[${item}] p-7`}>ayaz</div>
        })
      }
    </div>
  )
}

export default CreateWorkspace