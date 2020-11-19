# Portion size data

Functions related to portion size estimation and browsing the food database as a survey respondent.

## Get food data

Get portion size estimation options, associated foods and related data for a food from the database.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodDataController.scala#L96-L112)

### Request

```html
GET /api/user/foods/{locale}/{code}    

Authorization: Bearer {accessToken}
```

where

**locale** is the locale ID to get the food data for,

**code** is the Intake24 food code.

### Response

```json
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

<div style="margin-left: 3em">

**foodOrCategoryCode** is an array of 2 elements where the first element is either 0 or 1. If the 
first element is 0, then the second element is a food code, or, if the first element is 1, the second
element is a category code,

**promptText** is the wording of the associated food question,

**linkAsMain** controls whether accepted associated food suggestions should be created as "main" or "linked",

**genericName** is the simple name of the associated food, used by some UI elements (e.g., "bread", "sauce")

</div>

**portionSizeMethods** is the list of available portion size estimation options, where:

<div style="margin-left: 3em">

**method** is ID of the portion size estimation method to use,

**description** is the description of this portion size estimation option for the selection screen (localised 
string key),

**imageUrl** is the link to the image for the selection screen,

**useForRecipes** controls whether this portion size estimation option is appropriate for recipe ingredients,

**conversionFactor** is the multiplier for the final potion weight calculation (e.g. when portion size images 
do not represent the exact food but something similar that could have different density),

**parameters** is the object with fields specific to the portion size method.

</div>



## Get as served image set data

    @GET
    @Path("/user/portion-size/as-served/{id}")
    void getAsServedSet(@PathParam("id") String id, MethodCallback<AsServedSet> callback);

## Get multiple as served image sets data

    @POST
    @Path("/user/portion-size/as-served")
    void getAsServedSets(List<String> ids, MethodCallback<List<AsServedSet>> callback);

## Get guide image data

    @GET
    @Path("/user/portion-size/guide-image/{id}")
    void getGuideImage(@PathParam("id") String id, MethodCallback<GuideImage> callback);

## Get image map data

    @GET
    @Path("/user/portion-size/image-maps/{id}")
    void getImageMap(@PathParam("id") String id, MethodCallback<SImageMap> callback);

## Get multiple image maps data

    @POST
    @Path("/user/portion-size/image-maps")
    void getImageMaps(List<String> ids, MethodCallback<List<SImageMap>> callback);


## Get drink scale data

    @GET
    @Path("/user/portion-size/drinkware/{id}")
    void getDrinkwareSet(@PathParam("id") String id, MethodCallback<DrinkwareSet> callback);

## Weight entry dummy 

Dummy endpoint for manual weight entry estimation method

    @GET
    @Path("/user/portion-size/weight")
    void getWeightPortionSizeMethod(MethodCallback<PortionSizeMethod> callback);

## Get root category list for browsing

    @GET
    @Path("/user/categories/{locale}")
    void getRootCategories(@PathParam("locale") String localeId, MethodCallback<List<CategoryHeader>> callback);

## List category contents

    @GET
    @Path("/user/categories/{locale}/{code}")
    void getCategoryContents(@PathParam("locale") String localeId, @PathParam("code") String categoryCode,
                             @QueryParam("alg") String algorithmId, @QueryParam("existing") List<String> existingFoods,
                             MethodCallback<LookupResult> callback);

## Get automatic associated foods suggestions

    @GET
    @Path("/user/foods/associated/{locale}")
    void getAutomaticAssociatedFoods(@PathParam("locale") String localeId, @QueryParam("f") List<String> foodCodes, MethodCallback<AutomaticAssociatedFoods> callback);
