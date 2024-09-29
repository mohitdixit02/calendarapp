const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedHours = String(hours).padStart(2, '0');

    return `${formattedHours}:${minutes} ${period}`;
  };

const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export {
    formatTime,
    formatDate
};