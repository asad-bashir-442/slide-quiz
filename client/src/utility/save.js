export const save = (filename, data, options) => {
    const blob = new Blob(data, options);

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;

    // Create
    document.body.appendChild(link);
    link.click();

    // Remove
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
