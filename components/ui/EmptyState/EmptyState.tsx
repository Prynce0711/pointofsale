type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8bf9f] bg-[#fff8ef] px-6 py-10 text-center">
      <h3 className="text-sm font-semibold text-[#2c1810]">{title}</h3>
      {description ? <p className="mt-1 text-sm text-[#7b6254]">{description}</p> : null}
    </div>
  );
}

