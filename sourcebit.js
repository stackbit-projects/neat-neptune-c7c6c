const _ = require('lodash');

const isDev = process.env.NODE_ENV === 'development';


module.exports = {
    plugins: [
        {
            module: require('sourcebit-source-contentful'),
            options: {
                accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
                // deliveryToken is optional, if not specified will be automatically created and reused 
                deliveryToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
                // previewToken is optional, if not specified will be automatically created and reused
                previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN,
                spaceId: process.env.CONTENTFUL_SPACE_ID || 'vofxoz05en3v',
                // Which content environment to use, when Stackbit sets a split tests on Netlify, it use the BRANCH variable to identify the bucket
                environment: process.env.BRANCH || process.env.CONTENTFUL_ENVIRONMENT || 'master',
                preview: isDev,
                watch: isDev
            }
        },
        {
            module: require('sourcebit-target-next'),
            options: {
                liveUpdate: isDev,
                flattenAssetUrls: true,
                pages: [
                    { path: '/{stackbit_url_path}', predicate: _.matchesProperty('__metadata.modelName', 'home') },
                    { path: '/{stackbit_url_path}', predicate: _.matchesProperty('__metadata.modelName', 'advanced') },
                    { path: '/{stackbit_url_path}', predicate: _.matchesProperty('__metadata.modelName', 'store') },
                    { path: '/{stackbit_url_path}', predicate: _.matchesProperty('__metadata.modelName', 'category') },
                    { path: '/{stackbit_url_path}', predicate: _.matchesProperty('__metadata.modelName', 'product') }
                ],
                commonProps: (items) => {
                    return {
                        pages: _.filter(items, item => ["home","advanced","store","category","product"].includes(_.get(item, '__metadata.modelName'))),
                        data: {
                            config: _.find(items, _.matchesProperty('__metadata.modelName', 'config'))
                        }
                    };
                }
            }
        }
    ]
};
