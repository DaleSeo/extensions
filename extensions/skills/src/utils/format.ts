/**
 * Formats large numbers into human-readable format with K/M suffixes
 * @param count - The number to format
 * @returns Formatted string (e.g., 4797 -> "4.8K", 1500000 -> "1.5M")
 */
export function formatInstallCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}
