# Food database lookup

Functions related to searching food records in the food database.

## Split description

Detects multiple foods entered as a single entry and returns a suggested split into several foods.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodLookupController.scala#L52-L60)

### Request

```json
GET /api/foods/{locale}/split-description?desc={description}

Authorization: Bearer {accessToken}
```

where

**locale** is the locale ID (different locales could use different description splitting strategies),

**description** is the food description as entered by the user.

### Response

```json
{
  "parts": string[]
}
```

where

**parts** is the list of individual foods extracted from the original description.

## Food lookup

Returns a list of foods from the food database that match the description as entered by the user.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodLookupController.scala#L62-L74)

### Request

```json
GET /api/foods/{locale}/lookup?desc={description}&existing={existing}&limit={limit}&alg={algorithm}

Authorization: Bearer {accessToken}
```

where

**description** is the food description as entered by the user,

**existing** is an optional list of food codes representing other foods in the same meal, used by the search result
ranking algorithm (more than one can be specified by repeating the query parameter multiple times),

**limit** is an optional maximum number of results to return, defaults to 50

**algorithm** is an optional id of the search result ranking algorithm to use, defaults to "paRules". Can be one of:

- "paRules": pairwise association rules, a machine learning based algorithm
- "popularity": simple algorithm based on the number of times foods were selected

### Response

```json
{
  "foods": {
     "code": string,
     "localDescription": string
  },
  "categories": {
    "code": string,
    "localDescription": string
  },
}
```

where

**foods** is the list of foods that match the description,

**categories** is the list of categories that match the description,

**code** is the Intake24 food or category code,

**localDescription** is the food/category name from the food database in the local language for survey

## Food lookup (for recipes)

Same as normal lookup but expands the search results to foods marked for use in recipes (e.g. raw ingredients).

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodLookupController.scala#L95-L100)

### Request

```json
GET /api/foods/{locale}/lookup-for-recipes?desc={description}&existing={existing}&limit={limit}&alg={algorithm}

Authorization: Bearer {accessToken}
```

See regular food lookup request.

### Response

See regular food lookup response.

## Food lookup (in category)

Same as normal lookup but limits the search results to foods that are contained with a specific category.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodLookupController.scala#L103-L114)

### Request

```json
GET /api/foods/{locale}/lookup-in-category?desc={description}&category={category}existing={existing}&limit={limit}&alg={algorithm}

Authorization: Bearer {accessToken}
```

Query parameters are the same as regular food lookup plus

**category**: Intake24 category code to limit search to.

### Response

See regular food lookup response.

## Get root category list for browsing

Get the list of root categories in the current locale for the "browse all foods" options.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/FoodDataSQL/src/main/scala/uk/ac/ncl/openlab/intake24/foodsql/user/FoodBrowsingServiceImpl.scala#L28-L37)

### Request

```json
GET /api/categories/{locale}

Authorization: Bearer {accessToken}
```

where **locale** is the current survey's locale ID.

### Response

```json
[
  {
    "code": string,
    "localDescription": string
  },
  ...
]
```

where

**code** is the Intake24 category code,

**localDescription** is the description of the category in the local language.

## Browse category contents

Get the category contents, i.e. foods and subcategories listed under the given category.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/FoodDataSQL/src/main/scala/uk/ac/ncl/openlab/intake24/foodsql/user/FoodBrowsingServiceImpl.scala#L81-L89)

### Request

```json
GET /api/categories/{locale}/{code}?alg={algorithmId}&existing={existingFoodCode}

Authorization: Bearer {accessToken}
```

where

**locale** is the current survey's locale ID,

**code** is the Intake24 category code,

**algorithmId** (optional) is the algorithm to use for sorting the food/subcategory listings, can be `popularity` or
`paRules`,

**existing** (optional) is the list of foods in the same meal for `paRules` based ranking.

### Response

```json
{
  "foods": [
    {
      "code": string,
      "localDescription": string
    },
    ...
  ],
  "categories": [
    {
      "code": string,
      "localDescription": string
    },
    ...
  ]
}
```

where

**foods** is the list of foods contained in the category:

<div class="nested-description">

**code** is the Intake24 food code,

**localDescription** is the name of the food in the local language,

</div>

**categories** is the list of subcategories contained in the category:

<div class="nested-description">

**code** is the Intake24 category code,

**localDescription** is the name of the category in the local language,

</div>
