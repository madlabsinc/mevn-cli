module.exports = {
    title: 'MEVN CLI',
    description: 'Light speed setup for MEVN stack based apps',
    head: [
        ['link', { rel: 'icon', href: 'images/logo.png' }]
    ],
    themeConfig: {
    	repo: 'madlabsinc/mevn-cli',
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Guide', link: '/guide/'},
        ],
        sidebar: 'auto',
        docsDir: 'docs',
        editLinks: true,
    	editLinkText: 'Edit this page on GitHub'
    }
}
