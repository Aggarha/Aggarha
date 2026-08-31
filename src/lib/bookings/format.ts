/** Inclusive day count between two dates — shared by the rent request form's live total and createBookingRequestAction's persisted totalDays, so they never drift apart. */
export function calculateTotalDays(startDate: Date, endDate: Date): number {
  return Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
}
