const pagedTagsCollection = require('./_src/_includes/collections/pagedTags');

module.exports = function(config) {
    config.addPassthroughCopy('LICENSE');
    // Collections
    config.addCollection('posts', collection => collection.getFilteredByGlob('_src/posts/*.md'));
    config.addCollection('pagedTags', collection => {
        return pagedTagsCollection(collection);
    });
    config.addCollection('pagedTagsListing', collection => {
        return pagedTagsCollection(collection).reduce((accumulatorObject, currentItem) => {
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