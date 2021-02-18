# Portion size data

Functions related to portion size estimation and browsing the food database as a survey respondent.

## Get food data

Get portion size estimation options, associated foods and related data for a food from the database.

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodDataController.scala#L96-L112)

[v4 food boilerplate](https://github.com/MRC-Epid-it24/intake24/blob/master/api-server/src/http/controllers/food.controller.ts)

### Request

```http
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

**promptText** is the wording of the associated food question,

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

## Get as served image set data

Get as served image definitions for the given as served set.

### Request

```http
GET /api/portion-sizes/as-served-sets/{id}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where **id** is the as served image set ID.

### Response

```json
200 OK

{
    "id": string,
    "description": string,
    "selectionImageUrl": string,
    "images": [
      {
        "mainImageUrl": string,
        "thumbnailUrl": string,
        "weight": number
      },
      ...
    ]
}
```

where

**selectionImageUrl** is the URL of the image to use for portion size option selection screen,

**images** is the list of as served image definitions, where

<div class="nested-description">

**mainImageUrl** is the URL of the full-sized portion size image,

**thumbnailUrl** is the URL of the corresponding thumbnail image,

**weight** is the weight (in grams) of the food in this image

</div>  

## Get multiple as served image sets data

Same as above, but fetches data for multiple as served image sets at once.

### Request

```http
GET /api/portion-sizes/as-served-sets/?id[]={id}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where **id** is the list of as served image set ids to return.

### Response

Same as the regular as served data response, but returns an array of as served set objects:

```json
200 OK

[
  {
    "id": string,
    "description": string,
    "selectionImageUrl": string,
    "images": [
      {
        "mainImageUrl": string,
        "thumbnailUrl": string,
        "weight": number
      },
      ...
    ]
  },
  ...
]
```

## Get guide image data

Get definition of an image map which is an image of multiple objects from which one can be selected. Every object
has an associated weight that is used for portion size weight calculations. 

### Request

```http
GET /api/portion-sizes/guide-images/{id}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where **id** is the guide image ID.

### Response

```json
200 OK

{
  "description": string,
  "imageMap": {
    "baseImageUrl": string,
    "objects": [
      {
        "id": number,
        "description": string,
        "overlayUrl": string,
        "outline": number[]
      },
      ...
    ]
   },
   "weights": {
      "1": number,
      "2": number,
      ...
   }
}
```

where

**description** is the human-friendly description of the guide image,

**imageMap** is the underlying image map definition, where

<div class="nested-description">
  
**baseImageUrl** is the URL of the image with the selectable objects,

**objects** is the list of individual objects that can be selected, where

<div class="nested-description">

**id** is the object's index,

**description** is the human-friendly description of the object,

**overlayUrl** is the URL of the transparent image with the object's outline used to highlight the
current selection. The image has the same dimensions as the main image.

**outline** is the coordinates of the vertices of a polyline outline around the object used to detect 
which object in the image was clicked/tapped. The coordinates come in `(x, y)` pairs (i.e. the length of the 
array is always even) and are normalized such that the `x` coordinates are in the range `[0, 1]` and `y`
coordinates are in the range `[0, image width / image height]`.   

</div>
   
</div>

**weights** is the map of selectable object indices to weights in grams.


## Get multiple guide image data

Same as above, but returns several guide images at once.

### Request

```http
GET /api/portion-sizes/guide-images/?id[]={id}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where **id** is the list of guide image IDs.

### Response

Same as the regular guide image data request (see above), but returns an array of guide image objects.

## Get image map data

Returns an image map definition similar to guide images, but without the associated weights. Used for selecting
objects from images where the object is not directly associated with a weight, e.g. selecting pizza slice sizes
whose final weight also depends on pizza thickness and type.

### Request

```http
GET /api/portion-sizes/image-maps/{id}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where **id** is the image map ID.

### Response

Same as a guide image (see above), but without the weights:

```json
200 OK

{
  "baseImageUrl": string,
  "objects": [
    {
      "id": number,
      "description": string,
      "navigationIndex": number,
      "overlayUrl": string,
      "outline": number[]
    },
    ...
  ]
}
```
    
## Get multiple image maps data

Same as above, but returns several image maps at once.

### Request

```http
GET /api/portion-sizes/image-maps/?id[]={id}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where **id** is the list of image map IDs.

### Response

Same as the regular image map data request (see above), but returns an array of image map objects.

## Get drink scale data

Get the definition of "sliding scale" which is the portion size estimation for hot and cold drinks.

### Request

```http
GET /api/portion-sizes/drinkware-sets/{id}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where **id** is the drink scale ID.

### Response

```json
200 OK

{
  "id": string,
  "guideImageId": string,
  "scales": [
    {
      "baseImageUrl": string,
      "overlayImageUrl": string,
      "choiceId": number,
      "width": number,
      "height": number,
      "emptyLevel": number,
      "fullLevel": number,
      "volumeSamples": [
         {
           "fill": number,
           "volume": number
         }
      ]
    },
    ...
  ]
}
```

where

**id** is the drink scale ID.

**guideImageId** is the ID of the image map (called guide due to legacy reasons) for the drinkware selection screen,
e.g. an image with glasses of different shapes and sizes from which the respondent is asked to select one 
they would like to use.

**scales** is the list of sliding scale image definitions corresponding to objects in the image map `guideImageId`,
where:

<div class="nested-description">

**baseImageUrl** is the URL of the image with the individual empty glass/mug/cup,

**overlayImageUrl** is the URL of the transparent image with the filled outline of the same glass/mug/cup, used
to represent the liquid level,

**choiceId** is the ID of the object (glass/mug/cup) from the `guideImageId` image map this scale corresponds to,

**width** is the width of the image at `baseImageUrl`,

**height** is the height of the image at `baseImageUrl`,

**emptyLevel** is the offset in pixels from the bottom of the base image where the sliding scale starts (i.e. the
bottom of the glass/mug/cup),

**fullLevel** is the offset in pixels from the bottom of the base image where the sliding scale ends (i.e. the top of 
the glass/mug/cup),

**volumeSamples** is an array with the liquid volume samples taken at different fill levels, where:

<div class="nested-description">

**fill** is the normalised fill level, from `0` (corresponding to the bottom of the glass) to `1` (corresponding
to the top of the glass),

**volume** is the volume of liquid measured at this fill level 

</div> 

</div>

:::tip
The volume of the liquid is calculated by taking the current normalised fill level (i.e. 
`(current slider position - emptyLevel) / (fullLevel - emptyLevel)`) and interpolating between
the nearest two sample points from the `volumeSamples` array.

See [v3 implementation](https://github.com/MRC-Epid-it24/survey-frontend/blob/master/SurveyClient/src/main/java/uk/ac/ncl/openlab/intake24/client/api/foods/DrinkScale.java#L47-L63).  
:::


## Get multiple drinkware sets data

Same as above, but fetches data for multiple drinkware sets at once.

### Request

```http
GET /api/portion-sizes/drinkware-sets/?id[]={id}

Authorization: Bearer {accessToken}
Content-Type: application/json
```

where **id** is the list of drinkware set ids to return.

### Response

Same as the regular drinkware set data response, but returns an array of drinkware set objects:

```json
200 OK

[
  {
    "id": string,
    "guideImageId": string,
    "scales": [
      {
        "baseImageUrl": string,
        "overlayImageUrl": string,
        "choiceId": number,
        "width": number,
        "height": number,
        "emptyLevel": number,
        "fullLevel": number,
        "volumeSamples": [
          {
            "fill": number,
            "volume": number
          }
        ]
      },
      ...
    ]
  }
]
```

## Weight entry dummy 

Dummy endpoint for manual weight entry estimation method. The method has no parameters and this request is needed to 
get the image URL for the portion size option selection screen.

### Request

```http
GET /api/portion-sizes/weight

Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response

```json
200 OK

{
  "method": "weight",
  "description": "weight",
  "parameters": {},
  "imageUrl": string,
  "useForRecipes": true,
  "conversionFactor": 1.0
}
```

where only the **imageUrl** parameter is meaningful and everything else is constant.

## Get automatic associated foods suggestions

Get the automatically generated associated foods based on the pairwise associations algorithm. This method will
always suggest categories (as opposed to manually set up associated foods that can point to individual foods as 
well as categories).

[v3 implementation](https://github.com/MRC-Epid-it24/api-server/blob/master/ApiPlayServer/app/controllers/food/user/FoodDataController.scala#L154-L186)

### Request

```http
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
