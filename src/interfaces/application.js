/**
 * @typedef {"Bekliyor" | "Kabul Edildi" | "Reddedildi"} ApplicationStatus
 *
 * @typedef {Object} Application
 * @property {string} id
 * @property {string} company
 * @property {string} position
 * @property {string} date
 * @property {ApplicationStatus} status
 * @property {string} [notes]
 */

export const APPLICATION_STATUSES = [
  "Bekliyor",
  "Kabul Edildi",
  "Reddedildi",
];

export const STORAGE_KEY = "staj-proje-takip-kayitlari";

/**
 * @param {unknown} value
 * @returns {value is import("./application.js").Application[]}
 */
export function isApplicationList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.company === "string" &&
        typeof item.position === "string" &&
        typeof item.date === "string" &&
        APPLICATION_STATUSES.includes(item.status) &&
        (item.notes === undefined || typeof item.notes === "string"),
    )
  );
}
