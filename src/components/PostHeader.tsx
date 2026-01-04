'use client';

const DEFAULT_AVATAR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiNmM2YyZWYiLz48cGF0aCBkPSJNMzYgMzZ2LTNjMC0yLjIxLTEuNzktNC00LTRIMTZjLTIuMjEgMC00IDEuNzktNCA0djMiIHN0cm9rZT0iI2Q5ZDlkOSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjE4IiByPSI2IiBzdHJva2U9IiNkOWQ5ZDkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+';

interface PostHeaderProps {
  userName?: string;
  audience?: string;
}

export function PostHeader({ userName = 'John Doe', audience = 'Post to Anyone' }: PostHeaderProps) {
  return (
    <div className="bg-surface-dark p-3 px-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img
          src={DEFAULT_AVATAR}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-white text-lg font-medium leading-tight">{userName}</span>
          <span className="text-text-light text-sm font-normal">{audience}</span>
        </div>
      </div>
    </div>
  );
}
