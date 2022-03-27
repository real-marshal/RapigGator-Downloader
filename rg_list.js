/* Shared functions */

const getPremiumUrl = document => {
    const linkNode = document.querySelector('.container .overall .file-descr .btm a')

    return {
        url: linkNode.href,
        filename: linkNode.text.trim()
    }
}
/*
Background script doesn't have access to the host cookies
and you can't just retrieve and pass them to fetch either
so I have to get file urls in the content script
*/
const getFileUrls = async urls => {
    const fileUrls = []
    const htmlParser = new DOMParser()

    for (const url of urls) {
        const html = await fetch(url).then(res => res.text())
        const parsedDocument = htmlParser.parseFromString(html, 'text/html')

        fileUrls.push(getPremiumUrl(parsedDocument))
    }

    return fileUrls
}

/* Module */

(() => {
    const getTopMenu = () =>
        document.querySelector('.box-login ul')

    const onDownloadListClick = () => {
        const list = prompt('Link list separated by line breaks or spaces')

        if (!list) return
        
        const urls = list.replace(/rg\.to/g, 'rapidgator.net').split(' ')

        getFileUrls(urls)
            .then(fileUrls => browser.runtime.sendMessage({ urls: fileUrls }))
    }

    const createMenuElement = () => {
        const a = document.createElement('a')
        a.text = 'Download a list'
        a.addEventListener('click', onDownloadListClick)

        const li = document.createElement('li')
        li.appendChild(a)

        getTopMenu().prepend(li)
    }

    const main = () => {
        createMenuElement()
    }

    main()
})()
