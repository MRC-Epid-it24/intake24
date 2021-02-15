export type FoodDataEntryResponse = FoodLocalResponse & FoodAttributeResponse & FoodAdditionalDataResponse & CaloriesPer100gResponse

export type FoodLocalResponse = {
	code: string;
	localDescription: string;
	portionSizeMethods: PortionSizeMethodsResponse[] | [];
}

export type FoodAttributeResponse = {
	readyMealOption: boolean;
	sameAsBeforeOption: boolean;
}

export type FoodAdditionalDataResponse = {
	categories: string[] | [];
	associatedFoods: AssociatedFoodsResponse[] | [];
	brands: string[] | [];
}

export type PortionSizeMethodsResponse = {
	method: string;
	description: string;
	imageUrl: string;
	useForRecipes: boolean;
	conversionFactor: number;
	parameters: PortionSizeMethodsParametrsResponce[] | [];
} | []

export type PortionSizeMethodsParametrsResponce = {
	name: string,
	value: string
}

export type AssociatedFoodsResponse = {
	foodOrCategoryCode: [number, string];
	promptText: string;
	linkAsMain: boolean;
	genericName: string;
}

export type CaloriesPer100gResponse = {
	caloriesPer100g: number
}

export type FoodDataGeneral = {
	[key: string]: any; // FIXME: use more specific type
};
