const fs = require('fs-extra')
const concat = require('concat')

const build = async () => {
    const files = [
        './dist/project-wc/runtime.js',
        './dist/project-wc/polyfills.js',
        './dist/project-wc/main.js'
    ]

    await fs.ensureDir('dist/project-wc');
    await fs.ensureDir('project-webcomponent')
    await concat(files,'project-webcomponent/project-player-component.js')
    await fs.copy('./dist/project-wc/styles.css','project-webcomponent/styles.css')
}

build()