const lodashChunk = require('lodash.chunk');

module.exports = function(collection, { collectionAPI, size = 4 }) {
    let tagSet = new Set();

    collectionAPI.forEach(templateObjet => {
        if('tags' in templateObjet.data) {
            const tagsProperty = templateObjet.data.tags;
            if(Array.isArray(tagsProperty)) {
                tagsProperty.forEach(tag => tagSet.add(tag));
            } else if(typeof tagsProperty === 'string') {
                tagSet.add(tagsProperty);
            }
        }
    });

    const pagedTags = [];

    [...tagSet].forEach(tag => {
        const tagCollection = collection.getFilteredByTag(tag);
        const pagedCollection = lodashChunk(tagCollection, size);
        pagedCollection.forEach((templateObjectsArray, index) => {
            pagedTags.push({
                tagName: tag,
                path: `/tags/${tag}/${index ? (index + 1) + '/' : ''}`,
                pageNumber: index,
                templateObjets: templateObjectsArray
            });
        });
    });
    
    const groupedByTagName = lodashChunk(pagedTags, size);
    groupedByTagName.forEach(group => {
        group.forEach((pageObject, index, source) => {
            pageObject.first = source[0].path;
            pageObject.last = source[source.length - 1].path;
            if(source[index - 1]) pageObject.previous = source[index - 1].path;
            if(source[index + 1]) pageObject.next = source[index + 1].path;
        });
    });

    return pagedTags;
}