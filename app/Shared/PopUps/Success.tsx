export default function Success({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-[#cfdfb0] bg-[#f1f7e8] px-4 py-3 text-sm font-medium text-[#3e621d]">
      {message}
    </div>
  );
}
