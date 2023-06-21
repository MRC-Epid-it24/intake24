export const getAllChildCategories = `
  WITH RECURSIVE children(code) AS (
    SELECT code FROM categories WHERE code = :category
    UNION ALL
    SELECT cc.subcategory_code
    FROM categories_categories AS cc
    JOIN children ON children.code = cc.category_code
  ) SELECT code FROM children;`;

export const getAllParentCategories = `\
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
