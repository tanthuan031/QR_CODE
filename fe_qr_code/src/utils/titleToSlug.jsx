export const titleToSlug = (title) => {
  return title.replace(/ /g, '_').replace(/[^\w-]+/g, '');
};
