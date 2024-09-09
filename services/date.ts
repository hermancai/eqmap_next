/*
 * Returns client's current date in yyyy-mm-dd format
 * Handles timezone offset from UTC
 *
 * @returns {string} - yyyy-mm-dd
 */
const getClientTodayISOString = () => {
    const today = new Date();
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .substring(0, 10);
};

export { getClientTodayISOString };
