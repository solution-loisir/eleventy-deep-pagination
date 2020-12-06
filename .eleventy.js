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
        const pagedTag = [];
        [...tagSet].forEach(tag => {
            const tagCollection = collection.getFilteredByTag(tag);
            const pagedCollection = lodashChunk(tagCollection, 4);
            pagedCollection.forEach((templateObjectsArray, index) => {
                pagedTag.push({
                    tagName: tag,
                    path: `tags/${tag}/${index ? (index + 1) + '/' : ''}`,
                    pageNumber: index,
                    templateObjets: templateObjectsArray
                });
            });
        });
        //console.log(pagedTag);
        return pagedTag;
    });
    config.addCollection('pagedTagNavigation', collection => {
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
        const pagedTag = [];
        [...tagSet].forEach(tag => {
            const tagCollection = collection.getFilteredByTag(tag);
            const pagedCollection = lodashChunk(tagCollection, 4);
            pagedCollection.forEach((templateObjectsArray, index) => {
                pagedTag.push({
                    tagName: tag,
                    path: `/tags/${tag}/${index ? (index + 1) + '/' : ''}`,
                    pageNumber: index,
                    templateObjets: templateObjectsArray
                });
            });
        });
        const navigationObject = pagedTag.reduce((accumulatorObject, currentItem) => {
            const tagNameProp = currentItem.tagName;
            if(!accumulatorObject[tagNameProp]) accumulatorObject[tagNameProp] = [];
            accumulatorObject[tagNameProp].push(currentItem);
            return accumulatorObject;
        }, {});
        Object.keys(navigationObject).forEach(key => {
            navigationObject[key].forEach((objectItem, index, source) => {
                if(!index) objectItem.position = 'first';
                if(index === source.length - 1) objectItem.position = 'last';
                if(source[index - 1]) {
                    objectItem.previous = source[index - 1].path;
                } else {
                    objectItem.previous = false;
                }
                if(source[index + 1]) {
                    objectItem.next = source[index + 1].path;
                } else {
                    objectItem.next = false;
                }
            });
        });
        console.log(navigationObject);
        return navigationObject;
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