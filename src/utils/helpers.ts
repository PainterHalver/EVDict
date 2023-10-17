export const populateHtml = (html: string) => {
    return html
        .replace(/<d1/g, '<div class="')
        .replace(/<a1/g, '<a href="')
        .replace(/<s1/g, '<span class="')
        .replace(/<d3>/g, '</div></div></div>')
        .replace(/<s2>/g, '</span></span>');
};

export const filterBadChars = (word: string) => {
    const badChars = ['\\', '/', ':', '*', '?', '"', '>', '<', '|', ';', ',', '.'];
    word = word
        .split('')
        .filter(char => !badChars.includes(char))
        .join('');
    // replace - chỉ khi không phải là ký tự cuối (path-)
    return word
        .replace(/-(?=[a-zA-Z0-9]+($|\s))/g, ' ')
        .replace(/_/g, ' ')
        .trim();
};
