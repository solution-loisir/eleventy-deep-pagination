const { writeFile } = require('fs').promises;

module.exports = function(config) {
    // Sass pre-processing
    sassProcess('./style/index.scss', './_site/style/index.css');
    config.setBrowserSyncConfig({
        files: './_site/style/index.css'
    });
    // Passthrough copy
    const assets = []
    assets.forEach(asset => config.addPassthroughCopy(asset));
    // Collections
    config.addCollection('posts', collection => collection.getFilteredByGlob('_src/posts/*.md'));
    config.addCollection('postsTags', collection => {
       const posts = collection.getFilteredByTag('articles');
       let tagSet = new Set();
       posts.forEach(temp => {
           if('tags' in temp.data) {
            for(const tag of temp.data.tags) {
                tagSet.add(tag);
            }
           }
       });
       return [...tagSet];
    });
    config.addCollection('allTags', collection => {
        const allCollections = collection.getAllSorted();
        let tagSet = new Set();
        allCollections.forEach(temp => {
            if('tags' in temp.data) {
                for(const tag of temp.data.tags) {
                    tagSet.add(tag);
                }
            }
        });
        /*[...tagSet].forEach(tag => {
            writeFile(`./_src/${tag}/${tag}.njk`, `
            ---
            layout: base-layout
            pagination:
                data: collections.${tag}
                size: 6
                alias: tag
                addAllPagesToCollections: true
            eleventyComputed:
                title: "{{ tag | lower | slug }}"
            permalink: ${tag}/{{ tag | lower | slug }}/
            ---
            {% set posts = collections[tag] %}
            
            {% for post in posts %}
                <h1>{{ post.data.title }}</h1>
                <a href="{{ post.url }}"</a>
            {% endfor %}`)
            .catch(error => console.error(`Tag template error: `, error));
        });*/
        return [...tagSet];
    });
    // Aliases
    config.addLayoutAlias('base-layout', 'layouts/base-layout.njk');
    // Configuration
    return {
        dir: {
            input: '_src',
            output: '_site'
        },
        pathPrefix: '/',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        templateFormats: ['njk', 'html', 'md', '11ty.js']
    }
}