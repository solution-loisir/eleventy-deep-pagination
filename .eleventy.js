const pagedTags = require('./_src/_includes/collections/pagedTags');

module.exports = function(config) {
    config.addPassthroughCopy('LICENSE');
    // Collections
    config.addCollection('posts', collection => collection.getFilteredByGlob('_src/posts/*.md'));
    config.addCollection('pagedTags', collection => {
        const pagedTagsCollection = pagedTags(collection);
        return pagedTagsCollection.pages;
    });
    config.addCollection('pagedTagsListing', collection => {
        const pagedTagsCollection = pagedTags(collection);
        return pagedTagsCollection.groupedByTagName();
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