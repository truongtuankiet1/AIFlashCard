import Link from 'next/link';

export function BreadcrumbsNav({
  segments,
}: {
  segments: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Link href="/dashboard" className="hover:text-gray-900">
        Dashboard
      </Link>
      {segments.map((segment, index) => (
        <div key={index} className="flex items-center gap-2">
          <span>/</span>
          {segment.href ? (
            <Link href={segment.href} className="hover:text-gray-900">
              {segment.label}
            </Link>
          ) : (
            <span>{segment.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-12 text-center">
      <p className="text-gray-600 text-lg mb-4">{title}</p>
      <p className="text-gray-500 text-sm mb-6">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
