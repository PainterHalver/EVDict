export const populateHtml = (html: string) => {
    return html
        .replace(/<d1/g, '<div class="')
        .replace(/<a1/g, '<a href="')
        .replace(/<s1/g, '<span class="')
        .replace(/<d3>/g, '</div></div></div>')
        .replace(/<s2>/g, '</span></span>');
};