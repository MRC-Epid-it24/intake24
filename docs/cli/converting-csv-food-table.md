# Converting CSV Food Table to Package Format

This guide provides instructions on how to use the command-line interface (CLI) tool to convert a CSV file containing food table data into a package format.

## Prerequisites

Before you begin, ensure that you have the following:

- The CSV file containing the food table data.
- All supllementary json files are in the same folder as the CSV file (refer to the folder structure)
- The CLI tool build and ready to be used.

## Folder structure

The structure for the folder where the CSV file localed should be as following:

```
├─ <FOLDER WITH THE FOOD TABLE FILES>
   └─ * food-table.csv (The CSV file with the food data)
   └─ existing-categories.json (JSON file with the list of existing categories in the system. if not will request the list via the API)
   └─ * locales.json (JSON fiel with the information about the locale to be added. same format as the locales.json file for the importing a new package script)
   └─ category-psm.json (JSON file with the all default Portion SIme methods for the food categories presented in this locale. Can be used in case some foods in the food table are missing the `Method:` field)
   └─ * structure.json (JSON file with the structure / typing for the CSV file to be uploaded)
```

`*` - required

Please contact Intake24 team for the examples of the file or refer to .... **TBD**

### Food List CSV format

**food-table.csv**

# Converting CSV Food Table to Package Format

This guide provides instructions on how to use the command-line interface (CLI) tool to convert a CSV file containing food table data into a package format.

## Prerequisites

Before you begin, ensure that you have the following:

- The CSV file containing the food table data.
- All supplementary JSON files are in the same folder as the CSV file (refer to the folder structure).
- The CLI tool build and ready to be used.

## Folder structure

The structure for the folder where the CSV file is located should be as follows:

```
├─ <FOLDER WITH THE FOOD TABLE FILES>
    └─ * food-table.csv (The CSV file with the food data)
    └─ existing-categories.json (JSON file with the list of existing categories in the system. If not available, it will request the list via the API)
    └─ * locales.json (JSON file with the information about the locale to be added. Same format as the locales.json file for the importing a new package script)
    └─ category-psm.json (JSON file with all default Portion Size Methods for the food categories presented in this locale. Can be used in case some foods in the food table are missing the `Method:` field)
    └─ * structure.json (JSON file with the structure/typing for the CSV file to be uploaded)
```

`*` - required

Please contact the Intake24 team for examples of the file or refer to .... **TBD**

### Food List CSV format

**food-table.csv**

| Intake24 code | Action | English description                            | Local description                              | Food composition table | Food composition table record ID | Ready Meal Option | Same As Before Option | Reasonable Amount | Use In Recipes | Associated Food or Category | Brand Names | Portion size estimation methods                                                                                   | Categories | Milk in a hot drink | Revised local description |
| ------------- | ------ | ---------------------------------------------- | ---------------------------------------------- | ---------------------- | -------------------------------- | ----------------- | --------------------- | ----------------- | -------------- | --------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | ------------------------- |
| AABL          | 1      | Apple and blackcurrant squash (juice), diluted | Apple and blackcurrant squash (juice), diluted | AUSNUT                 | 01B30337                         | Inherited         | Inherited             | Inherited         | Inherited      |                             |             | Method: drink-scale, conversion: 1.0, drinkware-id: glasses_soft, initial-fill-level: 0.9, skip-fill-level: false | DRNK,SQDK  |                     |                           |

## Steps to Convert CSV to Package Format

1. Open your terminal or command prompt.

2. Navigate to the directory where the CLI tool is installed.

3. Run the following command to convert the CSV file to the package format:

```
pnpm run cli convert-to-package -t csv v4 <path_to_csv_file> <path_to_output_directory>
```

Replace `<path_to_csv_file>` with the actual path to your CSV file, and `<path_to_output_directory>` with the desired output directory.

4. Wait for the conversion process to complete. The CLI tool will generate the package files in the specified output directory.

5. Once the conversion is finished, you can use the generated files for the importing a package by copying a newely generated files into the pakcakge directory and replacing old ones if the exist.
