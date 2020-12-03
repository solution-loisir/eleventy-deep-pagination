const lodashChunk = require('lodash.chunk');

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
    config.addCollection('posts', collection => collection.getFilteredByGlob('_src/posts/*.md'));
    config.addCollection('pagedTag', collection => {
        const postsCollection = collection.getFilteredByGlob('_src/posts/*.md');
        let tagSet = new Set();
        postsCollection.forEach(templateObjet => {
            if('tags' in templateObjet.data) {
                const tagsProperty = templateObjet.data.tags;
                if(Array.isArray(tagsProperty)) {
                    tagsProperty.forEach(tag => tagSet.add(tag));
                } else if(typeof tagsProperty === 'string') {
                    tagSet.add(tagsProperty);
                }
            }
        });
        let pagedTagCollection = [];
        [...tagSet].forEach(tag => {
            const tagCollection = collection.getFilteredByTag(tag);
            const pagedCollection = lodashChunk(tagCollection, 4);
            let pageNumber = 0;
            pagedCollection.forEach(templateObjectsArray => {
                pagedTagCollection.push({
                    tagName: tag,
                    pageNumber: pageNumber++,
                    templateObjets: templateObjectsArray
                });
            });
        });
        return pagedTagCollection;
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