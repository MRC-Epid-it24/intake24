# Find portion size images

This tool will find portion size images that represent the amount of food having energy value closest to the specified
target value.

## Usage

1. Copy `config.json.example` to any location and edit the configuration.

```sh
cp src/commands/find-portion-images/config.json.example config.json
```

2. Run the command

```sh
pnpm cli find-portion-images --config config.json --output output.csv
```

Output file name is optional and will be automatically generated in the current directory if omitted.

## Configuration

```json
{
  "locale": "NDNSv1",
  "energyValueKcal": 240,
  "foodFilter": [],
  "portionSizeFilter": [],
  "batchSize": 500,
  "guideImageWidth": 654
}
```

**locale** is the food database locale that determines the list of foods that will be considered and also the list of
nutrients that will be calculated,

**energyValueKcal** is the target energy value to look for, in kcal,

**foodFilter** is an optional list of Intake24 food codes to limit the search to, leave empty to include all foods,

**portionSizeFilter** is an optional list of portion size image IDs (i.e., either as served set IDs or guide image IDs)
to limit the search to, leave empty to include all images,

**batchSize** is the number of foods to be included in a single database query,

**guideImageWidth** is the width of guide images, in pixels, used to calculate object bounding rectangles from the
object outline coordinates (these are stored in a normalised from independent from the actual image width).

## Output

The output is a CSV file. The file includes only those foods that have portion size images, i.e. foods that use
descriptive "standard portions" are not in this data set, but those that use as served and guide images are in.

Each row of the spreadsheet represents a combination of a food and a portion size image linked to that food, such
that the image represents the amount of food closest to the target energy value. Some foods have images for portion
sizes that are indeed very close to that value, but many do not; however they are still included.

The columns are as follows (using Excel column references):

**Columns A and B** are the Intake24 food codes and names.

**Column C (Portion size method)** can either be "as-served" or "guide-image".

**Column D (As served set/guide image ID)** is either the as served image set ID (if C is "as-served") or the guide image
ID (if C is "guide-image").

**Column E (Weight (image))** is the weight of the food portion in the image (for "as-served") or the weight of the
individual object (for "guide-image") that was measured when the photographs were taken.

**Column F (Weight (adjusted))** is the adjusted portion weight for the food in this row. This is typically the same as the
column E but could be different if the food in the image is not exactly the food being estimated (e.g. images of grapes
could be also used for olives).

**Column G (As served image path)** is the path to the "as served" image file corresponding to the weight in column E (only
if column C is "as-served")

**Column H (Guide image path)** is the path to the "guide" image corresponding to the weight in column E (only if column C
is "guide-image")

Guide images are a bit more complicated than "as served" because they contain multiple objects (e.g., tins, cans, packs,
bottles) in the same image. The following columns provide several ways of identifying the individual object:

**Column I (Guide object ID)** is the number of the object in the image. Most guide images (but not all) have object numbers
embedded directly in the image.

**Column J (Guide overlay path)** is the path to an overlay image outlining the relevant object. If this image is overlaid (
e.g. using ImageMagick's composite operation) on top of the image from column H it will result in an image with the
correct object highlighted.

**Column K (Guide object area)** contains pixel coordinates (xMin, yMin, xMax, yMax correspondingly with the top left of the
image being 0, 0) defining a rectangular area containing the relevant object. These can be used to extract just the
relevant object from the image referred to in column H.

**Column L** is the ID of the food composition table used to calculate the nutritional data.

**Column M** is the ID of the record from the food composition table that the Intake24 food in this row is linked to.

**Column N** is the name of the food as given in the food composition table.

**Columns O through DH** are the nutrient values calculated using the portion size weight from column F. The energy value in
kcal is in column U assuming default (NDNS) nutrient type list, but could be in another column for another locale. Check
the column headers.
