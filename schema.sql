-- Candies Studio — leads table (MySQL / MariaDB)
-- cPanel → phpMyAdmin → select your database → SQL tab → paste → Go

CREATE TABLE IF NOT EXISTS leads (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  reference        VARCHAR(20)  NULL UNIQUE,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status           ENUM('new','contacted','qualified','proposal_sent','converted','lost') NOT NULL DEFAULT 'new',

  name             VARCHAR(120) NOT NULL,
  email            VARCHAR(200) NOT NULL,
  phone            VARCHAR(30)  NOT NULL,
  country          VARCHAR(80)  NOT NULL,
  interests        VARCHAR(200) NOT NULL,
  message          TEXT         NOT NULL,

  campaign         VARCHAR(80)  NULL,
  landing_page_url VARCHAR(1000) NULL,
  referrer         VARCHAR(1000) NULL,
  utm_source       VARCHAR(200) NULL,
  utm_medium       VARCHAR(200) NULL,
  utm_campaign     VARCHAR(200) NULL,
  utm_content      VARCHAR(200) NULL,
  utm_term         VARCHAR(200) NULL,
  meta_campaign_id VARCHAR(64)  NULL,
  meta_adset_id    VARCHAR(64)  NULL,
  meta_ad_id       VARCHAR(64)  NULL,
  fbclid           VARCHAR(500) NULL,
  first_touch      TEXT         NULL,
  last_touch       TEXT         NULL,

  event_id         VARCHAR(80)  NULL UNIQUE,
  consent          TINYINT(1)   NOT NULL DEFAULT 0,
  tracking_consent TINYINT(1)   NOT NULL DEFAULT 0,
  capi_status      VARCHAR(60)  NULL,
  email_status     VARCHAR(60)  NULL,
  ip_hash          CHAR(64)     NULL,
  user_agent       VARCHAR(400) NULL,
  notes            TEXT         NULL,

  KEY idx_created (created_at),
  KEY idx_ip_time (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
