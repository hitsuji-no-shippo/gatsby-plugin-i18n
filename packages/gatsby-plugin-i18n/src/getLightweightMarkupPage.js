/**
 * Get page from lightweightMarkup
 * @param {*} options default options + user options
 * @param {*} postPage path.resolve(options.lightweightMarkup.postPage)
 * @param {*} edge allMarkdownRemark.edges
 * @return {*} page
 */
const getLightweightMarkupPage = (options, postPage) => edge => {
  const path = edge.node.fields.slug;
  const slug = edge.node.fields.slug;
  const langKey = edge.node.fields.langKey;

  return {
    path, // required
    component: postPage,
    context: {
      path, // For backward compatibility only...
      slug,
      langKey
    },
    layout: options.useLangKeyLayout ? langKey : null
  };
};

export default getLightweightMarkupPage;
