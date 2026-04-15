export const truncateText = (text, len) => {
    if (!text) return "";
    if (text.length <= len) return text;

    return text.substring(0, len) + "...";
};
