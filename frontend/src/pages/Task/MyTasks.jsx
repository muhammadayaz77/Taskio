import React, { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useGetMyTask from '../../hooks/task/useGetMyTask'

const STATUS_FILTERS = ['all', 'To Do', 'In Progress', 'Done', 'Archived']
const PRIORITY_FILTERS = ['High', 'Medium', 'Low']

function getStatusKey(s) {
  return s === 'To Do' ? 'todo' : s === 'In Progress' ? 'inprogress' : 'done'
}

function formatDate(iso) {
  if (!iso) return 'No date'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getDueDateClass(iso) {
  if (!iso) return 'text-slate-400'
  const diff = (new Date(iso) - new Date()) / 86400000
  return diff < 0 ? 'text-red-500' : diff < 3 ? 'text-yellow-500' : 'text-slate-500'
}

export default function MyTasks() {
  const { data, isLoading } = useGetMyTask()

  // ✅ FIX: Always ensure array
  const tasks = Array.isArray(data)
    ? data
    : Array.isArray(data?.tasks)
    ? data.tasks
    : []

  const [searchParams, setSearchParams] = useSearchParams()

  const filter = searchParams.get('filter') || 'all'
  const sort = searchParams.get('sort') || 'new'
  const search = searchParams.get('search') || ''

  function update(key, value) {
    const p = new URLSearchParams(searchParams)
    if (!value || value === 'all' || value === 'new') p.delete(key)
    else p.set(key, value)
    setSearchParams(p, { replace: true })
  }

  const filtered = useMemo(() => {
    let list = [...tasks]

    if (filter === 'Archived') list = list.filter(t => t.archieved)
    else if (['High', 'Medium', 'Low'].includes(filter))
      list = list.filter(t => t.priority === filter)
    else if (filter !== 'all')
      list = list.filter(t => t.status === filter)

    if (search)
      list = list.filter(t =>
        t.title?.toLowerCase().includes(search.toLowerCase())
      )

    list.sort((a, b) =>
      sort === 'old'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    )

    return list
  }, [tasks, filter, sort, search])

  if (isLoading)
    return <div className="p-8 text-slate-500">Loading tasks…</div>

  return (
    <div className="max-w-3xl mx-auto p-7 font-sans bg-white text-slate-900">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <h1 className="text-xl font-bold">My Tasks</h1>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-600">
          {tasks.length} tasks
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => update('sort', sort === 'new' ? 'old' : 'new')}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-700 hover:bg-slate-100"
          >
            {sort === 'new' ? 'New First' : 'Old First'}
          </button>

          <FilterDropdown current={filter} onSelect={f => update('filter', f)} />
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => update('search', e.target.value)}
          placeholder="Search tasks…"
          className="bg-white border border-slate-300 text-sm px-3 py-2 rounded-lg w-52 outline-none focus:border-violet-500"
        />
      </div>

      {/* Results */}
      <div className="text-xs text-slate-500 mb-3">
        {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No tasks found</p>
          </div>
        ) : (
          filtered.map(task => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  )
}

function TaskCard({ task }) {
  const dueCls = getDueDateClass(task.dueDate)

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50">
      <div>
        <div className="font-semibold">{task.title}</div>
        <div className="text-xs text-slate-500 flex gap-2 mt-1">
          <span>{task.status}</span>
          <span>{task.priority}</span>
        </div>
      </div>

      <div className={`text-xs ${dueCls}`}>
        {formatDate(task.dueDate)}
      </div>
    </div>
  )
}

function FilterDropdown({ current, onSelect }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef()

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-100"
      >
        Filter
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl p-2 shadow-lg z-50">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => {
                onSelect(f)
                setOpen(false)
              }}
              className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-100 rounded"
            >
              {f}
            </button>
          ))}

          <div className="border-t my-2" />

          {PRIORITY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => {
                onSelect(f)
                setOpen(false)
              }}
              className="block w-full text-left px-3 py-1 text-sm hover:bg-slate-100 rounded"
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}