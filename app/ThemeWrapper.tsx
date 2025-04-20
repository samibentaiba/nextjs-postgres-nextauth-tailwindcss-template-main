'use client';

export default function ThemeWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  // You can safely use hooks here
  return <>{children}</>;
}
