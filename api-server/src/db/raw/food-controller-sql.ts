const getAllParentCategories = `\
  WITH RECURSIVE parents AS (\
    SELECT cc.category_code \
    FROM public.categories_categories as cc \
      WHERE cc.subcategory_code IN (:subcategory_code) \
    UNION
      SELECT
        ccs.category_code \
      FROM public.categories_categories as ccs \
      INNER JOIN parents p ON p.category_code = ccs.subcategory_code\
  ) SELECT * FROM parents;`;

export default getAllParentCategories;
