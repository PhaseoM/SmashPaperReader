export function scrollToID(id: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }
    else {
        console.error(`Could not find scroll target with ID #${id}`);
    }
}