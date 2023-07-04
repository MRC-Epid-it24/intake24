# Food data

Functions related to browsing the food database as a survey respondent.

## Get food data

Get portion size estimation options, associated foods and related data for a food from the database.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodDataController.scala#L96-L112)

[v4 food boilerplate](https://github.com/MRC-Epid-it24/intake24/blob/master/apps/api/src/http/controllers/food.controller.ts)

### Request

```json
GET /api/foods/{locale}/{code}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where

**locale** is the locale ID to get the food data for,

**code** is the Intake24 food code.

### Response

```json
200 OK

{
  "code": string,
  "localDescription": string,
  "readyMealOption": boolean,
  "sameAsBeforeOption": boolean,
  "caloriesPer100g": number,
  "brands": string[],
  "categories": string[],
  "associatedFoods": [
    {
      "foodOrCategoryCode": [0, string] | [1, string],
      "promptText": string,
      "linkAsMain": boolean,
      "genericName": string
    },
    ...
  ],
  "portionSizeMethods": [
    {
      "method": "standard-portion" | "as-served" | "guide-image" | "cereal"
                | "drink-scale" | "milk-on-cereal" | "milk-in-a-hot-drink" | "pizza",
      "description": string,
      "imageUrl": string,
      "useForRecipes": boolean,
      "conversionFactor",
      "parameters": {
         "...": string,
          ...
       }
    }
  ]
}
```

where

**code** is the Intake24 food code,

**localDescription** is the name of the food in the current locale,

**readyMealOption** controls whether to display the ready meal prompt for this food,

**sameAsBeforeOption** controls whether to enable the same-as-before feature for this food,

**caloriesPer100g** is the amount of kcal per 100g of this food, used to trigger the low total energy prompt,

**brands** is the list of known brands for this food, used in the brands prompt,

**categories** is the list of all parent categories for this food, including transitive,

**associatedFoods** is the list of associated food suggestions, where:

<div class="nested-description">

**foodOrCategoryCode** is an array of 2 elements where the first element is either 0 or 1. If the
first element is 0, then the second element is a food code, or, if the first element is 1, the second
element is a category code,

**promptText** is the wording of the associated food prompt,

**linkAsMain** controls whether accepted associated food suggestions should be created as "main" or "linked",

**genericName** is the simple name of the associated food, used by some UI elements (e.g., "bread", "sauce")

</div>

**portionSizeMethods** is the list of available portion size estimation options, where:

<div class="nested-description">

**method** is ID of the portion size estimation method to use. See the
[portion size methods](../../developer/portion-size.html) guide for the list of currently supported methods.

**description** is the description of this portion size estimation option for the selection screen (localised
string key),

**imageUrl** is the link to the image for the selection screen,

**useForRecipes** controls whether this portion size estimation option is appropriate for recipe ingredients,

**conversionFactor** is the multiplier for the final potion weight calculation (e.g. when portion size images
do not represent the exact food but something similar that could have different density),

**parameters** is the object with fields specific to the portion size method. See the
[portion size methods](../../developer/portion-size.html) guide for details.

</div>

## Get automatic associated foods suggestions

Get the automatically generated associated foods based on the pairwise associations algorithm. This method will
always suggest categories (as opposed to manually set up associated foods that can point to individual foods as
well as categories).

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodDataController.scala#L154-L186)

### Request

```json
GET /api/foods/associated/{locale}?f={foodCode}&f={foodCode}...

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where

**locale** is the current locale ID,

**f** is the list of food codes in the meal (can be repeated)

### Response

A list of categories:

```json
[
  {
    "code": string,
    "localDescription": string
  }
]
```

where

**code** is the Intake24 category code,

**localDescription** is the name of the category in the local language,
