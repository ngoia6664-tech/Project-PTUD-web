"use client";

import { useState } from "react";
import { Info, Pencil, Trash2 } from "lucide-react";
import AdminScheduleForm from "@/components/admin/AdminScheduleForm";
import AdminMakeupNoticeForm from "@/components/admin/AdminMakeupNoticeForm";
import { WEEK_DAYS } from "@/lib/mock/dashboard";
import {
  ADMIN_CLASS_OPTIONS,
  MOCK_ADMIN_NOTICES_RESPONSE,
  MOCK_ADMIN_SCHEDULE_RESPONSE,
  type AdminMakeupNotice,
  type AdminScheduleEvent,
} from "@/lib/mock/admin";

/**
 * Trang Quản lý Lịch học chung (/admin/schedule).
 * GHI CHÚ QUAN TRỌNG: nhóm chưa chốt lịch do sinh viên tự nhập hay admin nhập.
 * Hiện tại dựng sẵn đầy đủ giao diện quản trị lịch lớp + nhập CSV + soạn thông báo nghỉ/dạy bù
 * để đội dự án dễ thống nhất quy trình sau này.
 */
export default function AdminSchedulePage() {
  // nhóm chưa chốt lịch do sinh viên tự nhập hay admin nhập
  const [selectedClass, setSelectedClass] = useState<string>(
    ADMIN_CLASS_OPTIONS[0],
  );
  const [events, setEvents] = useState<AdminScheduleEvent[]>(
    MOCK_ADMIN_SCHEDULE_RESPONSE.data,
  );
  const [notices, setNotices] = useState<AdminMakeupNotice[]>(
    MOCK_ADMIN_NOTICES_RESPONSE.data,
  );
  const [editingEvent, setEditingEvent] = useState<AdminScheduleEvent | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }

  const classEvents = events
    .filter((ev) => ev.classCode === selectedClass)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startPeriod - b.startPeriod);

  function handleSaveEvent(saved: AdminScheduleEvent) {
    setEvents((prev) => {
      const exists = prev.some((ev) => ev.id === saved.id);
      if (exists) return prev.map((ev) => (ev.id === saved.id ? saved : ev));
      return [...prev, saved];
    });
    setEditingEvent(null);
    showToast(`Đã lưu buổi học ${saved.courseCode} cho lớp ${saved.classCode}.`);
  }

  function handleDeleteEvent(id: string) {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    if (editingEvent?.id === id) setEditingEvent(null);
  }

  function handlePublishNotice(newNotice: AdminMakeupNotice) {
    setNotices((prev) => [newNotice, ...prev]);
    showToast(`Đã tạo thông báo cho lớp ${newNotice.classCode} (giao diện mẫu).`);
  }

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">
            Lịch học <span>chung theo lớp</span>
          </h2>
          <p className="admin-page-desc">
            Chọn lớp/học phần để quản lý buổi học, mô phỏng nhập CSV và gửi thông báo nghỉ/dạy bù.
          </p>
        </div>

        <div className="admin-chip-group" role="tablist" aria-label="Chọn lớp học phần">
          {ADMIN_CLASS_OPTIONS.map((cls) => (
            <button
              key={cls}
              type="button"
              role="tab"
              aria-selected={selectedClass === cls}
              className={`admin-chip ${
                selectedClass === cls ? "admin-chip--active" : ""
              }`}
              onClick={() => {
                setSelectedClass(cls);
                setEditingEvent(null);
              }}
            >
              Lớp {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Ghi chú quy trình đang chờ nhóm thống nhất */}
      <div className="admin-note-banner">
        <Info size={18} style={{ flex: "none", marginTop: 2 }} />
        <span>
          <strong>Lưu ý nghiệp vụ:</strong> Hiện nhóm chưa chốt lịch do sinh viên tự nhập hay admin nhập — màn hình này được dựng sẵn làm phương án quản trị tập trung.
        </span>
      </div>

      {toast && (
        <div className="admin-toast" role="status">
          {toast}
        </div>
      )}

      {/* Bảng danh sách buổi học của lớp đang chọn */}
      <section className="admin-card">
        <div className="admin-card-head">
          <h3 className="admin-card-title">
            Danh sách buổi học — Lớp {selectedClass}
          </h3>
          <span className="admin-badge admin-badge--gold admin-num">
            {classEvents.length} buổi/tuần
          </span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã HP</th>
                <th>Tên học phần</th>
                <th>Thứ</th>
                <th>Khung giờ</th>
                <th>Phòng</th>
                <th>Giảng viên</th>
                <th style={{ width: 140 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {classEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#5c5249", padding: 24 }}>
                    Lớp {selectedClass} chưa có buổi học nào.
                  </td>
                </tr>
              ) : (
                classEvents.map((ev) => {
                  const dayLabel =
                    WEEK_DAYS.find((d) => d.day === ev.dayOfWeek)?.label ?? "";
                  return (
                    <tr key={ev.id}>
                      <td style={{ fontWeight: 700, color: "#8b1218" }}>
                        {ev.courseCode}
                      </td>
                      <td style={{ fontWeight: 600 }}>{ev.courseName}</td>
                      <td>{dayLabel}</td>
                      <td className="admin-num">
                        Tiết {ev.startPeriod}–{ev.endPeriod} ({ev.startTime}–{ev.endTime})
                      </td>
                      <td>{ev.room}</td>
                      <td>{ev.lecturer}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm"
                            onClick={() => setEditingEvent(ev)}
                          >
                            <Pencil size={13} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger admin-btn--sm"
                            onClick={() => handleDeleteEvent(ev.id)}
                          >
                            <Trash2 size={13} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Form thêm/sửa buổi + Khung soạn thông báo nghỉ/dạy bù */}
      <div className="admin-two-col">
        <AdminScheduleForm
          key={editingEvent?.id ?? selectedClass}
          selectedClass={selectedClass}
          initialEvent={editingEvent}
          onSave={handleSaveEvent}
          onCancelEdit={() => setEditingEvent(null)}
          onCsvSelected={(fileName) =>
            showToast(
              `Đã chọn tệp CSV "${fileName}" (giao diện mẫu, chưa import backend).`,
            )
          }
        />

        <AdminMakeupNoticeForm
          selectedClass={selectedClass}
          notices={notices}
          onPublishNotice={handlePublishNotice}
        />
      </div>
    </div>
  );
}
