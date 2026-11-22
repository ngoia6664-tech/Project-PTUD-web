/**
 * Template tạo hiệu ứng chuyển trang mượt ease khi điều hướng giữa các trang /admin/*.
 */
export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-route-stage">{children}</div>;
}
