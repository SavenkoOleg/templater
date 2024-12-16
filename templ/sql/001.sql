CREATE TABLE "vars"
(
    id  SERIAL PRIMARY KEY,
    user_id INT,
    name VARCHAR,
    data VARCHAR,
    placeholder VARCHAR,
    create_date DATE
);

COMMENT ON TABLE "vars" IS 'Список переменных';

ALTER TABLE "vars" OWNER TO apps;