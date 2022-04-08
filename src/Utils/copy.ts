export function copy (text: string) {
    // Use the Async Clipboard API when available
    if ((navigator as any).clipboard) {
        return (navigator as any).clipboard.writeText(text)
    }

    // ...Otherwise, use document.execCommand() fallback

    // Put the text to copy into a <span>
    const span = document.createElement('span')
    span.textContent = text

    // Preserve consecutive spaces and newlines
    span.style.whiteSpace = 'pre'

    // An <iframe> isolates the <span> from the page's styles
    const iframe = document.createElement('iframe');
    (iframe as any).sandbox = 'allow-same-origin'

    // Add the <iframe> to the page
    document.body.appendChild(iframe)
    let win = iframe.contentWindow

    // Add the <span> to the <iframe>
    win!.document.body.appendChild(span)

    // Get a Selection object representing the range of text selected by the user
    let selection = win!.getSelection()

    // Fallback for Firefox which fails to get a selection from an <iframe>
    if (!selection) {
        win = window
        selection = win.getSelection()
        document.body.appendChild(span)
    }

    const range = win!.document.createRange()
    selection!.removeAllRanges()
    range.selectNode(span)
    selection!.addRange(range)

    let success = false
    try {
        success = win!.document.execCommand('copy')
    } catch (err) {
        success = false;
    }

    selection!.removeAllRanges()
    win!.document.body.removeChild(span)
    document.body.removeChild(iframe)

    // The Async Clipboard API returns a promise that may reject with `undefined` so we
    // match that here for consistency.
    return success
        ? Promise.resolve()
        : Promise.reject() // eslint-disable-line prefer-promise-reject-errors
}