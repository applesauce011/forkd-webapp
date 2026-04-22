export type RecipeItemType = "heading" | "item";

export interface RecipeHeading {
  type: "heading";
  text: string;
}

export interface RecipeIngredient {
  type: "item";
  text: string;
  id: string;
}

export type RecipeItem = RecipeHeading | RecipeIngredient;

export interface RecipeFormValues {
  title: string;
  ingredients: RecipeItem[];
  instructions: RecipeItem[];
  photos: string[]; // public URLs after upload
  servings: number | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  difficulty: "Easy" | "Medium" | "Hard" | null;
  visibility: "public" | "private";
  // Smart tags
  cuisine_primary: string | null;
  cuisine_secondary: string[];
  dietary: string[];
  contains_allergens: string[];
  meal_types: string[];
  dish_types: string[];
  main_ingredients: string[];
  methods: string[];
  spice_level: string | null;
  flavor_notes: string[];
  occasions: string[];
  // Optional for remix
  parent_id?: string | null;
}

export type RecipeDraft = RecipeFormValues & {
  savedAt: string;
  recipeId: string; // client-generated UUID for storage path
};
