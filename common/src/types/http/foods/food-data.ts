export type FoodDataEntryResponse = {
	code: string;
	localDescription: string | null;
	portionSizeMethods: PortionSizeMethodsResponse[] | [];
	readyMealOption: boolean | null;
	sameAsBeforeOption: boolean | null;
	categories: string[];
	associatedFoods: AssociatedFoodsResponse[];
	brands: string[];
};

export type PortionSizeMethodsResponse = {
	method: string;
	descripion: string;
	imageUrl: string;
	useForRecipes: boolean;
	conversionFactor: number;
	parameters: PortionSizeMethodsParametrsResponce[];
}

export type PortionSizeMethodsParametrsResponce = {
	[key: string]: string;
}

export type AssociatedFoodsResponse = {
	foodOrCategoryCode: [number, string];
	promptText: string;
	linkAsMain: boolean;
	genericName: string;
}
