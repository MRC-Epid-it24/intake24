#!/usr/bin/env bin/bash

# DEV environment

# System DB
psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE ROLE $DB_DEV_SYSTEM_USERNAME WITH PASSWORD '$DB_DEV_SYSTEM_PASSWORD' LOGIN;"
createdb -U $POSTGRES_USER --owner=$DB_DEV_SYSTEM_USERNAME $DB_DEV_SYSTEM_DATABASE
psql -U $POSTGRES_USER -d $DB_DEV_SYSTEM_DATABASE -c "create extension if not exists \"uuid-ossp\";"

# Foods DB
if [ $DB_DEV_FOODS_USERNAME != $DB_DEV_SYSTEM_USERNAME ]; then
    psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE ROLE $DB_DEV_FOODS_USERNAME WITH PASSWORD '$DB_DEV_FOODS_PASSWORD';"
fi
createdb -U $POSTGRES_USER --owner=$DB_DEV_FOODS_USERNAME $DB_DEV_FOODS_DATABASE
psql -U $POSTGRES_USER -d $DB_DEV_FOODS_DATABASE -c "create extension if not exists \"uuid-ossp\";"
psql -U $POSTGRES_USER -d $DB_DEV_FOODS_DATABASE -c "create extension if not exists \"btree_gist\";"


# TEST environment

# System DB
if [ "$DB_TEST_SYSTEM_USERNAME" ] && [ "$DB_TEST_SYSTEM_DATABASE" ]; then
    if [ $DB_TEST_SYSTEM_USERNAME != $DB_DEV_SYSTEM_USERNAME ]; then
        psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE ROLE $DB_TEST_SYSTEM_USERNAME WITH PASSWORD '$DB_TEST_SYSTEM_PASSWORD' LOGIN;"
    fi

    createdb -U $POSTGRES_USER --owner=$DB_TEST_SYSTEM_USERNAME $DB_TEST_SYSTEM_DATABASE;
    psql -U $POSTGRES_USER -d $DB_TEST_SYSTEM_DATABASE -c "create extension if not exists \"uuid-ossp\";"
fi

# Foods DB
if [ "$DB_TEST_FOODS_USERNAME" ] && [ "$DB_TEST_FOODS_DATABASE" ]; then
    if [ $DB_TEST_FOODS_USERNAME != $DB_DEV_SYSTEM_USERNAME ]; then
        psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE ROLE $DB_TEST_FOODS_USERNAME WITH PASSWORD '$DB_TEST_FOODS_PASSWORD' LOGIN;"
    fi

    createdb -U $POSTGRES_USER --owner=$DB_TEST_FOODS_USERNAME $DB_TEST_FOODS_DATABASE;
    psql -U $POSTGRES_USER -d $DB_TEST_FOODS_DATABASE -c "create extension if not exists \"uuid-ossp\";"
    psql -U $POSTGRES_USER -d $DB_TEST_FOODS_DATABASE -c "create extension if not exists \"btree_gist\";"
fi
