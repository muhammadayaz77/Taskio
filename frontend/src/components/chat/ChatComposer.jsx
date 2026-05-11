import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/button";

export default function ChatComposer({
  disabled,
  onSend,
  onTyping,
  placeholder,
  initialValue = "",
  submitLabel = "Send",
}) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);
  const typingTimer = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [value]);

  function fireTyping(next) {
    if (!onTyping) return;
    if (!isTypingRef.current && next) {
      isTypingRef.current = true;
      onTyping(true);
    }
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTyping(false);
      }
    }, 1500);
  }

  function handleSubmit(e) {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTyping?.(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-slate-200 bg-white px-4 py-3"
    >
      <textarea
        ref={textareaRef}
        value={value}
        disabled={disabled}
        placeholder={placeholder || "Write a message…"}
        rows={1}
        onChange={(e) => {
          setValue(e.target.value);
          fireTyping(e.target.value.length > 0);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="max-h-40 min-h-[40px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <Button
        type="submit"
        disabled={disabled || !value.trim()}
        className="h-10 rounded-2xl bg-violet-600 px-4 hover:bg-violet-700"
      >
        <Send className="size-4" />
        <span className="ml-2 hidden sm:inline">{submitLabel}</span>
      </Button>
    </form>
  );
}
