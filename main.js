const initialState = {
    currentDownloadItemId: null,
    currentIndex: 0,
    urls: []
}

let state = { ...initialState }

const getNextUrl = () => state.urls[state.currentIndex++]

const downloadFile = async ({ url, filename }) => {
    state.currentDownloadItemId = await browser.downloads.download({ url, filename })
}

const onDownload = ({ id, endTime }) => {
    /*
    downloads.DownloadItem.endTime - A string (in ISO 8601 format) representing
    the number of milliseconds between the UNIX epoch and when this download ended.
    This is undefined if the download has not yet finished.
    */
    if (id !== state.currentDownloadItemId || endTime) return

    const nextUrl = getNextUrl()

    if (!nextUrl) {
        state = { ...initialState }
        browser.downloads.onChanged.removeListener(onDownload)
        return
    }

    downloadFile(nextUrl)
}

const downloadFiles = ({ urls }) => {
    if (state.currentDownloadItemId) return

    state.urls = urls

    downloadFile(getNextUrl())

    browser.downloads.onChanged.addListener(onDownload)
}

browser.runtime.onMessage.addListener(downloadFiles)