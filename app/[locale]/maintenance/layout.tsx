// This layout prevents the parent layout from redirecting to maintenance page
// when we're already on the maintenance page (avoids redirect loops)
export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
