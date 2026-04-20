export const ago = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US");
};
