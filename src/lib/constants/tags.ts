export const CUISINE_TAGS = [
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "mexican", label: "Mexican" },
  { value: "chinese", label: "Chinese" },
  { value: "indian", label: "Indian" },
  { value: "thai", label: "Thai" },
  { value: "french", label: "French" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "american", label: "American" },
  { value: "korean", label: "Korean" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "greek", label: "Greek" },
  { value: "spanish", label: "Spanish" },
  { value: "middle_eastern", label: "Middle Eastern" },
  { value: "ethiopian", label: "Ethiopian" },
  { value: "caribbean", label: "Caribbean" },
  { value: "brazilian", label: "Brazilian" },
  { value: "german", label: "German" },
  { value: "british", label: "British" },
  { value: "other", label: "Other" },
];

export const DIETARY_TAGS = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "low_carb", label: "Low Carb" },
];

export const ALLERGEN_TAGS = [
  { value: "contains_gluten", label: "Gluten" },
  { value: "contains_dairy", label: "Dairy" },
  { value: "contains_nuts", label: "Nuts" },
  { value: "contains_egg", label: "Eggs" },
  { value: "contains_soy", label: "Soy" },
  { value: "contains_fish", label: "Fish" },
  { value: "contains_shellfish", label: "Shellfish" },
  { value: "contains_sesame", label: "Sesame" },
];

export const MEAL_TYPE_TAGS = [
  { value: "breakfast", label: "Breakfast" },
  { value: "brunch", label: "Brunch" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "dessert", label: "Dessert" },
  { value: "appetizer", label: "Appetizer" },
  { value: "side_dish", label: "Side Dish" },
  { value: "drink", label: "Drink" },
];

export const DISH_TYPE_TAGS = [
  { value: "pasta", label: "Pasta" },
  { value: "soup", label: "Soup" },
  { value: "salad", label: "Salad" },
  { value: "sandwich", label: "Sandwich" },
  { value: "cake", label: "Cake" },
  { value: "stew", label: "Stew" },
  { value: "curry", label: "Curry" },
  { value: "stir_fry", label: "Stir Fry" },
  { value: "roast", label: "Roast" },
  { value: "pizza", label: "Pizza" },
  { value: "burger", label: "Burger" },
  { value: "tacos", label: "Tacos" },
  { value: "bowl", label: "Bowl" },
  { value: "casserole", label: "Casserole" },
  { value: "baked_goods", label: "Baked Goods" },
  { value: "smoothie", label: "Smoothie" },
];

export const COOKING_METHOD_TAGS = [
  { value: "baking", label: "Baking" },
  { value: "grilling", label: "Grilling" },
  { value: "slow_cooker", label: "Slow Cooker" },
  { value: "air_fryer", label: "Air Fryer" },
  { value: "saute", label: "Sauté" },
  { value: "steaming", label: "Steaming" },
  { value: "frying", label: "Frying" },
  { value: "roasting", label: "Roasting" },
  { value: "pressure_cooker", label: "Pressure Cooker" },
  { value: "raw", label: "No Cook / Raw" },
  { value: "instant_pot", label: "Instant Pot" },
];

export const SPICE_LEVEL_TAGS = [
  { value: "mild", label: "Mild" },
  { value: "medium", label: "Medium" },
  { value: "spicy", label: "Spicy" },
  { value: "very_hot", label: "Very Hot" },
];

export const OCCASION_TAGS = [
  { value: "weeknight", label: "Weeknight" },
  { value: "weekend", label: "Weekend" },
  { value: "entertaining", label: "Entertaining" },
  { value: "holiday", label: "Holiday" },
  { value: "meal_prep", label: "Meal Prep" },
  { value: "date_night", label: "Date Night" },
  { value: "potluck", label: "Potluck" },
  { value: "bbq", label: "BBQ" },
];

export const MAIN_INGREDIENT_TAGS = [
  { value: "chicken", label: "Chicken" },
  { value: "beef", label: "Beef" },
  { value: "pork", label: "Pork" },
  { value: "lamb", label: "Lamb" },
  { value: "fish", label: "Fish" },
  { value: "shrimp", label: "Shrimp" },
  { value: "tofu", label: "Tofu" },
  { value: "lentils", label: "Lentils" },
  { value: "beans", label: "Beans" },
  { value: "eggs", label: "Eggs" },
  { value: "mushrooms", label: "Mushrooms" },
  { value: "pasta", label: "Pasta" },
  { value: "rice", label: "Rice" },
  { value: "potatoes", label: "Potatoes" },
  { value: "vegetables", label: "Vegetables" },
  { value: "cheese", label: "Cheese" },
  { value: "chocolate", label: "Chocolate" },
  { value: "fruit", label: "Fruit" },
];

export const FLAVOR_NOTE_TAGS = [
  { value: "savory", label: "Savory" },
  { value: "sweet", label: "Sweet" },
  { value: "spicy", label: "Spicy" },
  { value: "umami", label: "Umami" },
  { value: "tangy", label: "Tangy" },
  { value: "rich", label: "Rich" },
  { value: "fresh", label: "Fresh" },
  { value: "smoky", label: "Smoky" },
  { value: "citrusy", label: "Citrusy" },
  { value: "creamy", label: "Creamy" },
];

/** All tag groups for use in SmartTags display */
export const TAG_GROUPS = {
  cuisine: CUISINE_TAGS,
  dietary: DIETARY_TAGS,
  contains_allergens: ALLERGEN_TAGS,
  meal_types: MEAL_TYPE_TAGS,
  dish_types: DISH_TYPE_TAGS,
  methods: COOKING_METHOD_TAGS,
  spice_level: SPICE_LEVEL_TAGS,
  occasions: OCCASION_TAGS,
  main_ingredients: MAIN_INGREDIENT_TAGS,
  flavor_notes: FLAVOR_NOTE_TAGS,
} as const;

export function getTagLabel(group: keyof typeof TAG_GROUPS, value: string): string {
  const tags = TAG_GROUPS[group] as Array<{ value: string; label: string }>;
  return tags.find((t) => t.value === value)?.label ?? value;
}
