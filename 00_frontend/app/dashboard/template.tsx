export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="dash-route-stage">{children}</div>;
}
