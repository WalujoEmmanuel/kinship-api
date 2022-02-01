
CREATE SCHEMA IF NOT EXISTS kinship;

CREATE TABLE kinship.company(
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  tin VARCHAR NULL,
  telephone VARCHAR NULL,
  email VARCHAR NULL,
  createddate VARCHAR NULL,
  createdtime VARCHAR NULL,
  createdby VARCHAR NULL,
  modifieddate VARCHAR NULL,
  modifiedtime VARCHAR NULL,
  modifiedby VARCHAR NULL
);

CREATE TABLE kinship.user_types (
  user_type_id SERIAL PRIMARY KEY,
  user_type_name VARCHAR NULL,
  status VARCHAR NULL,
  createddate timestamp NULL DEFAULT NOW(),
  createdby VARCHAR NULL,
  modifieddate timestamp NULL DEFAULT NOW(),
  modifiedby VARCHAR NULL
);

CREATE TABLE kinship.users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NULL,
  passwd VARCHAR NOT NULL,
  phone_number VARCHAR NULL,
  master_id VARCHAR NULL,
  user_type_id INT NULL,
  status VARCHAR NULL,
  createddate timestamp NULL DEFAULT NOW(),
  createdby VARCHAR NULL,
  modifieddate timestamp NULL DEFAULT NOW(),
  modifiedby VARCHAR NULL,
  FOREIGN KEY (user_type_id) REFERENCES kinship.user_types (user_type_id) ON DELETE RESTRICT
);

CREATE TABLE kinship.refresh_tokens (
  token_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  status VARCHAR NULL,
  createddate timestamp NULL DEFAULT NOW(),
  createdby VARCHAR NULL,
  modifieddate timestamp NULL DEFAULT NOW(),
  modifiedby VARCHAR NULL,
  FOREIGN KEY (user_id) REFERENCES kinship.users (user_id) ON DELETE CASCADE
);

CREATE TABLE kinship.notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  notification_icon VARCHAR NULL,
  notification_type VARCHAR NULL,
  notification_title VARCHAR NULL,
  notification_body VARCHAR NULL,
  viewed BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR NULL,
  createddate timestamp NULL DEFAULT NOW(),
  createdby VARCHAR NULL,
  modifieddate timestamp NULL DEFAULT NOW(),
  modifiedby VARCHAR NULL,
  FOREIGN KEY (user_id) REFERENCES kinship.users (user_id) ON DELETE CASCADE
);

CREATE TABLE kinship.transaction_types (
  transaction_type_id SERIAL PRIMARY KEY,
  transaction_type_name VARCHAR NULL,
  status VARCHAR NULL,
  createddate timestamp NULL DEFAULT NOW(),
  createdby VARCHAR NULL,
  modifieddate timestamp NULL DEFAULT NOW(),
  modifiedby VARCHAR NULL
);

CREATE TABLE kinship.transaction_categories (
  transaction_category_id SERIAL PRIMARY KEY,
  transaction_category_name VARCHAR NULL,
  status VARCHAR NULL,
  createddate timestamp NULL DEFAULT NOW(),
  createdby VARCHAR NULL,
  modifieddate timestamp NULL DEFAULT NOW(),
  modifiedby VARCHAR NULL
);

CREATE TABLE kinship.transactions (
  id SERIAL PRIMARY KEY,
  transaction_id INT NOT NULL,
  transaction_type_id INT NOT NULL,
  transaction_category_id INT NOT NULL,
  description VARCHAR NULL,
  amount VARCHAR NULL,
  from_account VARCHAR NULL,
  to_account VARCHAR NULL,
  status VARCHAR NULL,
  createddate timestamp NULL DEFAULT NOW(),
  createdby VARCHAR NULL,
  modifieddate timestamp NULL DEFAULT NOW(),
  modifiedby VARCHAR NULL,
  FOREIGN KEY (transaction_type_id) REFERENCES kinship.transaction_types (transaction_type_id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_category_id) REFERENCES kinship.transaction_categories (transaction_category_id) ON DELETE CASCADE
);
