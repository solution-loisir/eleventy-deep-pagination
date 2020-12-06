const lodashChunk = require('lodash.chunk');

module.exports = function(config) {
    config.addPassthroughCopy('LICENSE');
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
        let pagedTagGroupSize;
        [...tagSet].forEach(tag => {
            const tagCollection = collection.getFilteredByTag(tag);
            const pagedCollection = lodashChunk(tagCollection, 4);
            pagedCollection.forEach((templateObjectsArray, index) => {
                pagedTagGroupSize = index;
                pagedTag.push({
                    tagName: tag,
                    path: `/tags/${tag}/${index ? (index + 1) + '/' : ''}`,
                    pageNumber: index,
                    templateObjets: templateObjectsArray
                });
            });
        });
        const pageGroup = lodashChunk(pagedTag, ++pagedTagGroupSize);
        pageGroup.forEach(pageGroup => {
            pageGroup.forEach((pageObject, index, source) => {
                pageObject.first = source[0].path;
                pageObject.last = source[source.length - 1].path;
                if(source[index - 1]) pageObject.previous = source[index - 1].path;
                if(source[index + 1]) pageObject.next = source[index + 1].path;
            });
        });
        //console.log(pagedTagGroupSize, pageGroup);
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
        let pagedTagGroupSize;
        [...tagSet].forEach(tag => {
            const tagCollection = collection.getFilteredByTag(tag);
            const pagedCollection = lodashChunk(tagCollection, 4);
            pagedCollection.forEach((templateObjectsArray, index) => {
                pagedTagGroupSize = index;
                pagedTag.push({
                    tagName: tag,
                    path: `/tags/${tag}/${index ? (index + 1) + '/' : ''}`,
                    pageNumber: index,
                    templateObjets: templateObjectsArray
                });
            });
        });
        const pageGroup = lodashChunk(pagedTag, ++pagedTagGroupSize);
        pageGroup.forEach(pageGroup => {
            pageGroup.forEach((pageObject, index, source) => {
                pageObject.first = source[0].path;
                pageObject.last = source[source.length - 1].path;
                if(source[index - 1]) pageObject.previous = source[index - 1].path;
                if(source[index + 1]) pageObject.next = source[index + 1].path;
            });
        });
        return pagedTag.reduce((accumulatorObject, currentItem) => {
            const tagNameProp = currentItem.tagName;
            if(!accumulatorObject[tagNameProp]) accumulatorObject[tagNameProp] = [];
            accumulatorObject[tagNameProp].push(currentItem);
            return accumulatorObject;
        }, {});
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