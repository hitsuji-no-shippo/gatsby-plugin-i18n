import defaultOptions from './defaultOptions';
import logError from './logError';
import path from 'path';
import getLightweightMarkupPage from './getLightweightMarkupPage';
import R from 'ramda';

// Test git

const createPages = (_, pluginOptions) => {

  if (!(
    R.path(['lightweightMarkup'], pluginOptions) &&
    R.path(['lightweightMarkup', 'query'], pluginOptions) &&
    R.path(['lightweightMarkup', 'postPage'], pluginOptions)
  )) {
    return null;
  }

  const options = {
    ...defaultOptions,
    ...pluginOptions
  };

  const { graphql, actions } = _;
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const postPage = path.resolve(options.lightweightMarkup.postPage);

    graphql(options.lightweightMarkup.query).then(result => {
      try {

        if (result.errors) {
          throw result.errors;
        }

        result.data[`all` + options.lightweightMarkup.language].edges
          .filter(R.path(['node', 'fields', 'slug']))
          .map(getLightweightMarkupPage(options, postPage))
          .map(page => createPage(page));

        resolve();

      } catch (e) {
        logError(e);
        reject(e);
      }
    });
  });
};

export {
  createPages
};
