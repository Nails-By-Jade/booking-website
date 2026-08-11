export function formatPHP(amount: number): string {
  return `₱${amount.toLocaleString("en-PH")}`;
}

// "09:00" -> "9am", "13:30" -> "1:30pm"
export function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "am" : "pm";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, "0")}${period}`;
}