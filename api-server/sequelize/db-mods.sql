-- categories
ALTER TABLE categories RENAME TO old_categories;

ALTER TABLE categories_attributes DROP CONSTRAINT categories_attributes_category_code_fk;
ALTER TABLE categories_categories DROP CONSTRAINT categories_categories_category_code_fk;
ALTER TABLE categories_categories DROP CONSTRAINT categories_categories_subcategory_code_fk;
ALTER TABLE categories_portion_size_methods DROP CONSTRAINT categories_portion_size_methods_categories_code_fk;
ALTER TABLE categories_local DROP CONSTRAINT categories_local_category_code_fk;
ALTER TABLE foods_categories DROP CONSTRAINT foods_categories_category_code_fk;
ALTER TABLE associated_foods DROP CONSTRAINT associated_food_prompts_assoc_category_fk;

ALTER TABLE old_categories DROP CONSTRAINT categories_pk;

CREATE TABLE categories (
	id bigserial NOT NULL,
	code varchar(32) NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	is_hidden bool NOT NULL,
	"version" uuid NOT NULL,
	CONSTRAINT categories_pk PRIMARY KEY (id)
);

-- Removed DB constraint - better to guard this in business logic code? ...easily maintainable in app rather than chaning DB structure.
-- CONSTRAINT min_code_length CHECK ((char_length((code)::text) > 3))

ALTER TABLE categories ADD CONSTRAINT categories_code_un UNIQUE (code);

INSERT INTO categories (code, "name", is_hidden, "version") SELECT code, description, is_hidden, "version" FROM old_categories;


-- category_attributes
ALTER TABLE categories_attributes RENAME TO old_categories_attributes;

-- VERIFY - shouldn't the `use_in_recipes` column be a boolean?
CREATE TABLE category_attributes (
	id bigserial NOT NULL,
	category_id int8 NULL,
	category_code varchar(32) NOT NULL,
	same_as_before_option bool NULL,
	ready_meal_option bool NULL,
	reasonable_amount int4 NULL,
	use_in_recipes int4 NULL,
	CONSTRAINT category_attributes_pk PRIMARY KEY (id)
);
CREATE INDEX category_attributes_category_id_idx ON category_attributes USING btree (category_id);

ALTER TABLE category_attributes ADD CONSTRAINT category_attributes_category_id_fk FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO category_attributes (id, category_code, same_as_before_option, ready_meal_option, reasonable_amount, use_in_recipes) SELECT id, category_code, same_as_before_option, ready_meal_option, reasonable_amount, use_in_recipes FROM old_categories_attributes;

UPDATE category_attributes SET category_id = categories.id from categories WHERE category_attributes.category_code = categories.code;

ALTER TABLE category_attributes ALTER COLUMN category_id SET NOT NULL;


-- categories_categories
ALTER TABLE categories_categories RENAME TO old_categories_categories;

ALTER TABLE old_categories_categories DROP CONSTRAINT categories_categories_pk;
ALTER TABLE old_categories_categories ADD CONSTRAINT old_categories_categories_pk PRIMARY KEY (id);

-- to consider - category record could just have `parent_id` column for parent category -> might be easier for processing, just recursively process data to create a tree ?
CREATE TABLE category_category (
	id bigserial NOT NULL,
	category_id int8 NULL,
	subcategory_id int8 NULL,
	category_code varchar(32) NOT NULL,
	subcategory_code varchar(32) NOT NULL
);

ALTER TABLE category_category ADD CONSTRAINT category_category_category_id_fk FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE category_category ADD CONSTRAINT category_category_subcategory_id_fk FOREIGN KEY (subcategory_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO category_category (id, category_code, subcategory_code) SELECT id, category_code, subcategory_code FROM old_categories_categories;

UPDATE category_category SET category_id = categories.id from categories WHERE category_category.category_code = categories.code;
UPDATE category_category SET subcategory_id = categories.id from categories WHERE category_category.subcategory_code = categories.code;

ALTER TABLE category_category ALTER COLUMN category_id SET NOT NULL;
ALTER TABLE category_category ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE category_category DROP COLUMN id;

ALTER TABLE category_category ADD CONSTRAINT category_category_pk PRIMARY KEY (category_id, subcategory_id);


-- categories_local
ALTER TABLE categories_local RENAME TO old_categories_local;

CREATE TABLE category_locals (
	id bigserial NOT NULL,
	category_id int8 NULL,
	category_code varchar(32) NOT NULL,
	locale_id varchar(16) NOT NULL,
	"name" varchar(255) NULL,
	simple_name varchar(255) NULL,
	description text NULL,
	"version" uuid NOT NULL,
	CONSTRAINT category_locals_pk PRIMARY KEY (id)
);

CREATE INDEX category_locals_category_id_idx ON category_locals USING btree (category_id);

ALTER TABLE category_locals ADD CONSTRAINT category_locals_category_id_fk FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO category_locals (category_code, locale_id, "name", simple_name, "version") SELECT category_code, locale_id, local_description, simple_local_description, "version" FROM old_categories_local;

UPDATE category_locals SET category_id = categories.id from categories WHERE category_locals.category_code = categories.code;

ALTER TABLE category_locals ALTER COLUMN category_id SET NOT NULL;


-- category_local_lists
CREATE TABLE category_local_lists (
	category_local_id int8 NOT NULL,
    locale_id varchar(16) NOT NULL,
	CONSTRAINT category_local_lists_pk PRIMARY KEY (category_local_id, locale_id)
);

ALTER TABLE category_local_lists ADD CONSTRAINT category_local_lists_category_local_id_fk FOREIGN KEY (category_local_id) REFERENCES category_locals(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE category_local_lists ADD CONSTRAINT category_local_lists_locale_id_fk FOREIGN KEY (locale_id) REFERENCES locales(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO category_local_lists (category_local_id, locale_id) SELECT id, locale_id FROM category_locals;


-- category_portion_size_method_params
ALTER TABLE categories_portion_size_method_params RENAME TO category_portion_size_method_params;

-- drop FK -> restore later when `category_portion_size_methods` table ready
ALTER TABLE category_portion_size_method_params DROP CONSTRAINT categories_portion_size_method_params_portion_size_method_id_fk;


-- category_portion_size_methods
ALTER TABLE categories_portion_size_methods RENAME TO old_categories_portion_size_methods;

CREATE TABLE category_portion_size_methods (
	id bigserial NOT NULL,
	category_local_id int8 NULL,
	category_code varchar(32) NOT NULL,
	locale_id varchar(16) NOT NULL,
	"method" varchar(32) NOT NULL,
	description varchar(255) NOT NULL,
	image_url varchar(512) NULL,
	use_for_recipes bool NOT NULL,
	conversion_factor float8 NOT NULL DEFAULT 1.0,
	CONSTRAINT category_portion_size_methods_pk PRIMARY KEY (id)
);
CREATE INDEX category_portion_size_methods_category_local_id_idx ON category_portion_size_methods USING btree (category_local_id);

ALTER TABLE category_portion_size_methods ADD CONSTRAINT category_portion_size_methods_category_local_id_fk FOREIGN KEY (category_local_id) REFERENCES category_locals(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO category_portion_size_methods (id, category_code, locale_id, "method", description, image_url, use_for_recipes, conversion_factor) SELECT id, category_code, locale_id, "method", description, image_url, use_for_recipes, conversion_factor FROM old_categories_portion_size_methods;

UPDATE category_portion_size_methods SET category_local_id = category_locals.id from category_locals WHERE category_portion_size_methods.category_code = category_locals.category_code AND category_portion_size_methods.locale_id = category_locals.locale_id;

ALTER TABLE category_portion_size_methods ALTER COLUMN category_local_id SET NOT NULL;

-- restore PSM params FK
ALTER TABLE category_portion_size_method_params ADD CONSTRAINT category_portion_size_method_params_portion_size_method_id_fk FOREIGN KEY (portion_size_method_id) REFERENCES category_portion_size_methods(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- foods
ALTER TABLE foods RENAME TO old_foods;
DROP INDEX foods_food_group_index;

CREATE TABLE foods (
	id bigserial NOT NULL,
	code varchar(32) NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	food_group_id int8 NOT NULL,
	"version" uuid NOT NULL,
	CONSTRAINT foods_pk PRIMARY KEY (id)
);

-- Removed DB constraint - better to guard this in business logic code? ...easily maintainable in app rather than chaning DB structure.
-- CONSTRAINT min_code_length CHECK ((char_length((code)::text) > 3))

CREATE INDEX foods_food_group_idx ON foods USING btree (food_group_id);

ALTER TABLE foods ADD CONSTRAINT foods_code_un UNIQUE (code);
ALTER TABLE foods ADD CONSTRAINT food_group_id_fk FOREIGN KEY (food_group_id) REFERENCES food_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO foods (code, "name", food_group_id, "version") SELECT code, description, food_group_id, "version" FROM old_foods;


-- food_attributes
ALTER TABLE foods_attributes RENAME TO old_foods_attributes;

-- VERIFY - shouldn't the `use_in_recipes` column be a boolean?
CREATE TABLE food_attributes (
	id bigserial NOT NULL,
	food_id int8 NULL,
	food_code varchar(32) NOT NULL,
	same_as_before_option bool NULL,
	ready_meal_option bool NULL,
	reasonable_amount int4 NULL,
	use_in_recipes int4 NULL,
	CONSTRAINT food_attributes_pk PRIMARY KEY (id)
);

CREATE INDEX food_attributes_food_id_idx ON food_attributes USING btree (food_id);

ALTER TABLE food_attributes ADD CONSTRAINT food_attributes_food_id_fk FOREIGN KEY (food_id) REFERENCES foods(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO food_attributes (id, food_code, same_as_before_option, ready_meal_option, reasonable_amount, use_in_recipes) SELECT id, food_code, same_as_before_option, ready_meal_option, reasonable_amount, use_in_recipes FROM old_foods_attributes;

UPDATE food_attributes SET food_id = foods.id from foods WHERE food_attributes.food_code = foods.code;

ALTER TABLE food_attributes ALTER COLUMN food_id SET NOT NULL;


-- food_categories
ALTER TABLE foods_categories RENAME TO old_foods_categories;

-- VERIFY - droped `id` column -> turned into pivot many-to-many table
CREATE TABLE food_category (
	id bigserial NOT NULL,
	food_id int8 NULL,
	category_id int8 NULL,
	food_code varchar(32) NOT NULL,
	category_code varchar(32) NOT NULL
);
CREATE INDEX food_category_category_id_idx ON food_category USING btree (category_id);
CREATE INDEX food_category_food_id_idx ON food_category USING btree (food_id);

ALTER TABLE food_category ADD CONSTRAINT food_category_category_code_fk FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE food_category ADD CONSTRAINT food_category_food_id_fk FOREIGN KEY (food_id) REFERENCES foods(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO food_category (id, food_code, category_code) SELECT id, food_code, category_code FROM old_foods_categories;

UPDATE food_category SET food_id = foods.id from foods WHERE food_category.food_code = foods.code;
UPDATE food_category SET category_id = categories.id from categories WHERE food_category.category_code = categories.code;

ALTER TABLE food_category ALTER COLUMN food_id SET NOT NULL;
ALTER TABLE food_category ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE food_category ADD CONSTRAINT food_category_pk PRIMARY KEY (food_id, category_id);

ALTER TABLE food_category DROP COLUMN id;


-- food_locals
ALTER TABLE foods_local RENAME TO old_foods_local;

-- removed `local` prefix in description fields <-- duplication
CREATE TABLE food_locals (
	id bigserial NOT NULL,
	food_id int8 NULL,
    food_code varchar(32) NOT NULL,
	locale_id varchar(16) NOT NULL,
	"name" varchar(255) NULL,
	simple_name varchar(255) NULL,
	description text NULL,
	"version" uuid NOT NULL,
    CONSTRAINT food_locals_pk PRIMARY KEY (id)
);

CREATE INDEX food_locals_food_id_idx ON food_locals USING btree (food_id);

ALTER TABLE food_locals ADD CONSTRAINT food_locals_food_id_fk FOREIGN KEY (food_id) REFERENCES foods(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO food_locals (food_code, locale_id, "name", simple_name, "version") SELECT food_code, locale_id, local_description, simple_local_description, "version" FROM old_foods_local;

UPDATE food_locals SET food_id = foods.id from foods WHERE food_locals.food_code = foods.code;

ALTER TABLE food_locals ALTER COLUMN food_id SET NOT NULL;


-- food_local_lists
ALTER TABLE foods_local_lists RENAME TO old_foods_local_lists;

CREATE TABLE food_local_lists (
	food_local_id int8 NULL,
    food_code varchar(32) NOT NULL,
    locale_id varchar(16) NOT NULL
);

ALTER TABLE food_local_lists ADD CONSTRAINT food_local_lists_food_id_fk FOREIGN KEY (food_local_id) REFERENCES food_locals(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE food_local_lists ADD CONSTRAINT food_local_lists_locale_id_fk FOREIGN KEY (locale_id) REFERENCES locales(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO food_local_lists (food_code, locale_id) SELECT food_code, locale_id FROM old_foods_local_lists;

UPDATE food_local_lists SET food_local_id = food_locals.id from food_locals WHERE food_local_lists.food_code = food_locals.food_code AND food_local_lists.locale_id = food_locals.locale_id;

-- VERIFY - all records having `food_local_id` NULL are `en_GB` based -- > assuming we can run this query to assign them `en_GB` `food_local` record
UPDATE food_local_lists SET food_local_id = food_locals.id from food_locals WHERE food_local_lists.food_local_id IS NULL AND food_local_lists.food_code = food_locals.food_code AND food_locals.locale_id = 'en_GB';

ALTER TABLE food_local_lists ALTER COLUMN food_local_id SET NOT NULL;

ALTER TABLE food_local_lists ADD CONSTRAINT food_local_lists_pk PRIMARY KEY (food_local_id, locale_id);


-- food_nutrient_mapping
ALTER TABLE foods_nutrient_mapping RENAME TO old_foods_nutrient_mapping;

CREATE TABLE food_nutrient_mapping (
    food_local_id int8 NULL,
    food_code varchar(32) NOT NULL,
	locale_id varchar(16) NOT NULL,
	nutrient_table_id varchar(64) NOT NULL,
	nutrient_table_record_id varchar(64) NOT NULL
);

ALTER TABLE food_nutrient_mapping ADD CONSTRAINT food_nutrient_mapping_food_local_id_fk FOREIGN KEY (food_local_id) REFERENCES food_locals(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE food_nutrient_mapping ADD CONSTRAINT food_nutrient_tables_nutrient_table_id_fk FOREIGN KEY (nutrient_table_id) REFERENCES nutrient_tables(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE food_nutrient_mapping ADD CONSTRAINT food_nutrient_tables_nutrient_table_record_fk FOREIGN KEY (nutrient_table_record_id, nutrient_table_id) REFERENCES nutrient_table_records(id, nutrient_table_id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO food_nutrient_mapping (food_code, locale_id, nutrient_table_id, nutrient_table_record_id) SELECT food_code, locale_id, nutrient_table_id, nutrient_table_record_id FROM old_foods_nutrient_mapping;

UPDATE food_nutrient_mapping SET food_local_id = food_locals.id from food_locals WHERE food_nutrient_mapping.food_code = food_locals.food_code AND food_nutrient_mapping.locale_id = food_locals.locale_id;

ALTER TABLE food_nutrient_mapping ALTER COLUMN food_local_id SET NOT NULL;

ALTER TABLE food_nutrient_mapping ADD CONSTRAINT food_nutrient_mapping_pk PRIMARY KEY (food_local_id, nutrient_table_id, nutrient_table_record_id);


-- category_portion_size_method_params
ALTER TABLE foods_portion_size_method_params RENAME TO food_portion_size_method_params;

-- drop FK -> restore later when `food_portion_size_methods` table ready
ALTER TABLE food_portion_size_method_params DROP CONSTRAINT foods_portion_size_method_params_portion_size_method_id_fk;


-- food_portion_size_methods
ALTER TABLE foods_portion_size_methods RENAME TO old_foods_portion_size_methods;

CREATE TABLE food_portion_size_methods (
	id bigserial NOT NULL,
    food_local_id int8 NULL,
	food_code varchar(32) NOT NULL,
	locale_id varchar(16) NOT NULL,
	"method" varchar(32) NOT NULL,
	description varchar(255) NOT NULL,
	image_url varchar(512) NULL,
	use_for_recipes bool NOT NULL,
	conversion_factor float8 NOT NULL DEFAULT 1.0,
	CONSTRAINT food_portion_size_methods_pk PRIMARY KEY (id)
);

CREATE INDEX food_portion_size_methods_food_local_id_idx ON food_portion_size_methods USING btree (food_local_id);

ALTER TABLE food_portion_size_methods ADD CONSTRAINT food_portion_size_methods_food_local_id_fk FOREIGN KEY (food_local_id) REFERENCES food_locals(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO food_portion_size_methods (id, food_code, locale_id, "method", description, image_url, use_for_recipes, conversion_factor) SELECT id, food_code, locale_id, "method", description, image_url, use_for_recipes, conversion_factor FROM old_foods_portion_size_methods;

UPDATE food_portion_size_methods SET food_local_id = food_locals.id from food_locals WHERE food_portion_size_methods.food_code = food_locals.food_code AND food_portion_size_methods.locale_id = food_locals.locale_id;

ALTER TABLE food_portion_size_methods ALTER COLUMN food_local_id SET NOT NULL;

-- restore params FK
ALTER TABLE food_portion_size_method_params ADD CONSTRAINT food_portion_size_method_params_portion_size_method_id_fk FOREIGN KEY (portion_size_method_id) REFERENCES food_portion_size_methods(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- associated_foods
ALTER TABLE associated_foods RENAME TO old_associated_foods;

ALTER TABLE old_associated_foods DROP CONSTRAINT associated_food_prompts_pk;
ALTER TABLE old_associated_foods ADD CONSTRAINT old_associated_food_prompts_pk PRIMARY KEY (id);

DROP INDEX associated_foods_index;

CREATE TABLE associated_foods (
	id bigserial NOT NULL,
    food_local_id int8 NULL,
	food_code varchar(32) NOT NULL,
	locale_id varchar(16) NOT NULL,
    associated_food_id int8 NULL,
	associated_category_id int8 NULL,
	associated_food_code varchar(32) NULL,
	associated_category_code varchar(32) NULL,
	"name" varchar(255) NOT NULL,
	"text" varchar(1024) NOT NULL,
	link_as_main bool NOT NULL,
	CONSTRAINT associated_foods_pk PRIMARY KEY (id)
);

CREATE INDEX associated_foods_idx ON associated_foods USING btree (food_local_id);

ALTER TABLE associated_foods ADD CONSTRAINT associated_foods_assoc_category_fk FOREIGN KEY (associated_category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE associated_foods ADD CONSTRAINT associated_foods_assoc_food_fk FOREIGN KEY (associated_food_id) REFERENCES foods(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE associated_foods ADD CONSTRAINT associated_foods_food_local_id_fk FOREIGN KEY (food_local_id) REFERENCES food_locals(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO associated_foods (id, food_code, locale_id, associated_food_code, associated_category_code, "text", link_as_main, "name") SELECT id, food_code, locale_id, associated_food_code, associated_category_code, "text", link_as_main, generic_name FROM old_associated_foods;

UPDATE associated_foods SET food_local_id = food_locals.id from food_locals WHERE associated_foods.food_code = food_locals.food_code AND associated_foods.locale_id = food_locals.locale_id;

UPDATE associated_foods SET associated_food_id = foods.id from foods WHERE associated_foods.associated_food_code = foods.code;
UPDATE associated_foods SET associated_category_id = categories.id from categories WHERE associated_foods.associated_category_code = categories.code;

ALTER TABLE associated_foods ALTER COLUMN food_local_id SET NOT NULL;

ALTER TABLE associated_foods ADD CONSTRAINT either_food_or_category CHECK ((((associated_food_id IS NOT NULL) AND (associated_category_id IS NULL)) OR ((associated_food_id IS NULL) AND (associated_category_id IS NOT NULL))));


-- brands
ALTER TABLE brands RENAME TO old_brands;

ALTER TABLE old_brands DROP CONSTRAINT brands_pk;
ALTER TABLE old_brands ADD CONSTRAINT old_brands_pk PRIMARY KEY (id);

DROP INDEX brands_food_code_index;

CREATE TABLE brands (
	id bigserial NOT NULL,
    food_local_id int8 NULL,
	food_code varchar(32) NOT NULL,
	locale_id varchar(16) NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	CONSTRAINT brands_pk PRIMARY KEY (id)
);

CREATE INDEX brands_food_local_id_idx ON brands USING btree (food_local_id);

ALTER TABLE brands ADD CONSTRAINT brands_food_local_id_fk FOREIGN KEY (food_local_id) REFERENCES food_locals(id) ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO brands (id, food_code, locale_id, "name") SELECT id, food_code, locale_id, "name" FROM old_brands;

UPDATE brands SET food_local_id = food_locals.id from food_locals WHERE brands.food_code = food_locals.food_code AND brands.locale_id = food_locals.locale_id;

ALTER TABLE brands ALTER COLUMN food_local_id SET NOT NULL;


--- clean up

ALTER TABLE category_attributes DROP COLUMN category_code;

ALTER TABLE category_category DROP COLUMN category_code;
ALTER TABLE category_category DROP COLUMN subcategory_code;

ALTER TABLE category_portion_size_methods DROP COLUMN category_code;
ALTER TABLE category_portion_size_methods DROP COLUMN locale_id;

ALTER TABLE category_locals DROP COLUMN category_code;
ALTER TABLE category_locals DROP COLUMN locale_id;

ALTER TABLE food_attributes DROP COLUMN food_code;

ALTER TABLE food_category DROP COLUMN food_code;
ALTER TABLE food_category DROP COLUMN category_code;

ALTER TABLE food_locals DROP COLUMN food_code;
ALTER TABLE food_locals DROP COLUMN locale_id;

ALTER TABLE food_local_lists DROP COLUMN food_code;

ALTER TABLE food_nutrient_mapping DROP COLUMN food_code;
ALTER TABLE food_nutrient_mapping DROP COLUMN locale_id;

ALTER TABLE food_portion_size_methods DROP COLUMN food_code;
ALTER TABLE food_portion_size_methods DROP COLUMN locale_id;

ALTER TABLE associated_foods DROP COLUMN food_code;
ALTER TABLE associated_foods DROP COLUMN locale_id;
ALTER TABLE associated_foods DROP COLUMN associated_food_code;
ALTER TABLE associated_foods DROP COLUMN associated_category_code;

ALTER TABLE brands DROP COLUMN food_code;
ALTER TABLE brands DROP COLUMN locale_id;

DROP TABLE old_foods_attributes;
DROP TABLE old_foods_categories;
DROP TABLE old_foods_local_lists;
DROP TABLE old_foods_nutrient_mapping;
DROP TABLE old_foods_portion_size_methods;

DROP TABLE old_categories_attributes;
DROP TABLE old_categories_categories;
DROP TABLE old_categories_portion_size_methods;

DROP TABLE old_associated_foods;
DROP TABLE old_brands;

DROP TABLE old_foods_local;
DROP TABLE old_categories_local;
DROP TABLE old_foods;
DROP TABLE old_categories;

-- VERIFY - not needed table anymore?
DROP TABLE foods_restrictions;
