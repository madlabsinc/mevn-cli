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
        sidebar: {
            '/guide/': [{
                title: 'Table Of Contents',
                collapsable: false,
                children: [
                    '',
                    '/guide/prerequisites.html',
                    '/guide/install.html',
                    '/guide/commands.html',
                    '/guide/file-hierarchy.html',
                    '/guide/features.html',
                    '/guide/contributing.html',
                    '/guide/versioning.html'
                ]
            }],
        },
        docsDir: 'docs',
        editLinks: true,
    	editLinkText: 'Edit this page on GitHub'
    }
}
