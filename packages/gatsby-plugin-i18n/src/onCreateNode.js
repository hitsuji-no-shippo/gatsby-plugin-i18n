import defaultOptions from './defaultOptions';
import { isInPagesPaths, getSlugAndLang } from 'ptz-i18n';
import Result from 'folktale/result';
import { isNil, chain, path } from 'ramda';

const getValidFile = filePath =>
  isNil(filePath)
    ? Result.Error('No file name')
    : Result.Ok(filePath);

const getFilePath = (node, makrupLanguage, fileAbsolutePathField) => {
  switch(node.internal.type){
    case 'File': return getValidFile(node.absolutePath);
    case makrupLanguage: return getValidFile(path(fileAbsolutePathField, node));
    default: return Result.Error('Skiping file type: ' + node.internal.type);
  }
};


/**
 * Add custom url pathname for blog posts.
 * @param {*} args args
 * @param {*} pluginOptions plugin options from gatsby-config.js
 * @returns {void} void
 */
const onCreateNode = ({ node, actions }, pluginOptions) => {

  const options = {
    ...defaultOptions,
    ...pluginOptions
  };

  const { lightweightMarkup } = options;
  const makrupLanguage = lightweightMarkup.language || 'MarkdownRemark';

  return getFilePath(
    node,
    makrupLanguage,
    (lightweightMarkup.fileAbsolutePathField || 'fileAbsolutePath').split('.')
  ).map(filePath =>
    chain(isInPaths => {

      if(isInPaths === false){
        return 'Skipping page, not in pagesPaths';
      }

      const slugAndLang = getSlugAndLang(options, filePath);

      const { createNodeField } = actions;

      if(node.internal.type === makrupLanguage) {
        createNodeField({
          node,
          name: 'langKey',
          value: slugAndLang.langKey
        });
      }

      createNodeField({
        node,
        name: 'slug',
        value: slugAndLang.slug
      });

      return 'langKey and slug added';
    }, isInPagesPaths(options, filePath))
  )
    .merge();
};

export {
  onCreateNode
};
