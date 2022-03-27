(() => {
    const classPrefix = 'rg-downloader'

    const classes = {
        downloadAll: `${classPrefix}-download-all`,
    }

    const css = `
        .${classes.downloadAll} {
            font-size: 14px;
            padding: 7px;
            border-color: antiquewhite;
            background-color: orange;
            color: white;
            border-radius: 3px;
            border-width: 0px;
            font-weight: bold;
            text-shadow: 0px 1px 1px #00000070;
        }

        .${classes.downloadAll}:hover {
            cursor: pointer;
        }

        .container .overall .file-descr .btm {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            padding: 7px;
        }

        .container .overall .file-descr .btm p {
            width: auto !important;
        }
    `

    const getDownloadButtonContainer = () =>
        document.querySelector('.container .overall .file-descr .btm')

    const getUrls = () => {
        const links = document.querySelectorAll('.container .overall .items tbody a')
        return [...links].map(link => link.href)
    }

    const onDownloadClick = () => {
        const urls = getUrls()

        getFileUrls(urls)
            .then(fileUrls => browser.runtime.sendMessage({ urls: fileUrls }))
    }

    const createDownloadButton = () => {
        const downloadButton = document.createElement('button')

        downloadButton.textContent = 'Download all'
        downloadButton.className = `${classes.downloadAll}`
        downloadButton.addEventListener('click', onDownloadClick)

        return downloadButton
    }

    const injectHTML = () => {
        const container = getDownloadButtonContainer()
        container.append(createDownloadButton())
    }

    const injectStyle = cssString => {
        const style = document.createElement('style')
        style.textContent = cssString
        document.head.append(style)
    }

    const main = () => {
        injectStyle(css)
        injectHTML()
    }

    main()
})()
