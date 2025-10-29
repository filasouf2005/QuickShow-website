export const dateFormat = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday : "short",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
}
