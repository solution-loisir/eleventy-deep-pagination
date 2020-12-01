const { writeFileSync } = require('fs');

module.exports = function(config) {
    // Sass pre-processing
    /*
    sassProcess('./style/index.scss', './_site/style/index.css');
    config.setBrowserSyncConfig({
        files: './_site/style/index.css'
    });
    */
    // Passthrough copy
    /*
    const assets = []
    assets.forEach(asset => config.addPassthroughCopy(asset));
    */
    // Collections
    config.addCollection('allTags', collection => {
        const allCollections = collection.getFilteredByGlob('_src/posts/*.md');
        let tagSet = new Set();
        allCollections.forEach(temp => {
            if('tags' in temp.data) {
                for(const tag of temp.data.tags) {
                    tagSet.add(tag);
                }
            }
        });
        [...tagSet].forEach(tag => {
            writeFileSync(`./_src/${tag}.njk`, `
---
layout: base-layout.njk
pagination:
    data: collections.${tag}
    size: 4
    alias: tag
    addAllPagesToCollections: true
eleventyComputed:
    title: "{{ tag | lower | slug }}"
permalink: "tags/{{ pagination.pageNumber }}/index.html"
---
{% set posts = collections[tag] %}
            
{% for post in posts %}
<h1>{{ post.data.title }}</h1>
<a href="{{ post.url }}">${tag}</a>
{% endfor %}`);
        });
        return [...tagSet];
    });
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
        templateFormats: ['njk', 'md']
    }
}