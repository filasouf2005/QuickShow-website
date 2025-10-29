const isoTimeFormat = (dateTime: string | number | Date) => {
    const date = new Date(dateTime);
    const localTime = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return localTime;
};

export default isoTimeFormat;
