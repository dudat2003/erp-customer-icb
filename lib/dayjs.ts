import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

// Load plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

// Set Vietnamese as default locale
dayjs.locale("vi");

export default dayjs;

// Helper functions for common formats
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "N/A";
  return dayjs(date).format("DD/MM/YYYY");
};

export const formatDateTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "N/A";
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

export const formatDateLong = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "N/A";
  return dayjs(date).format("DD [tháng] MM [năm] YYYY, HH:mm");
};

export const formatTime = (date: string | Date | null | undefined): string => {
  if (!date) return "N/A";
  return dayjs(date).format("HH:mm:ss");
};

export const formatRelative = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "N/A";
  return dayjs(date).fromNow();
};

// Get month name in Vietnamese
export const getMonthName = (date: Date): string => {
  return dayjs(date).format("MMMM");
};
