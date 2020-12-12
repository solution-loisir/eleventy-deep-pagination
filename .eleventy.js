const pagedTags = require('./_src/_includes/collections/pagedTags');

module.exports = function(config) {
    config.addPassthroughCopy('LICENSE');
    // Collections
    config.addCollection('posts', collection => collection.getFilteredByGlob('_src/posts/*.md'));
    config.addCollection('pagedTags', collection => {
        return pagedTags(collection);
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