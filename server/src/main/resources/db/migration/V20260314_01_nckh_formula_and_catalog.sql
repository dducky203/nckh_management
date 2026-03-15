ALTER TABLE nckh_activity
	ADD COLUMN publication_name VARCHAR(255) NULL,
	ADD COLUMN activity_date DATE NULL,
	ADD COLUMN venue VARCHAR(255) NULL,
	ADD COLUMN identifier_code VARCHAR(255) NULL,
	ADD COLUMN external_link VARCHAR(500) NULL,
	ADD COLUMN proof_file_url VARCHAR(500) NULL,
	ADD COLUMN proof_image_url VARCHAR(500) NULL,
	ADD COLUMN details_json TEXT NULL,
	ADD COLUMN main_author_user_id INT NULL,
	ADD COLUMN member_user_ids TEXT NULL;

INSERT INTO nckh_activity_catalog(catalog_code, name, unit, quota_hours, is_shareable, metric_key, is_active)
VALUES
	('SEMINAR_PRESENT', 'Seminar trình bày chuyên đề', 'bài', 10, 1, 'SEMINAR', 1),
	('CONF_ORG_INTL', 'Tổ chức hội thảo quốc tế', 'lần', 100, 1, 'CONFERENCE', 1),
	('CONF_ORG_NAT', 'Tổ chức hội thảo quốc gia', 'lần', 60, 1, 'CONFERENCE', 1),
	('CONF_ORG_ACAD', 'Tổ chức hội thảo học viện', 'lần', 20, 1, 'CONFERENCE', 1),
	('CONF_PRES_INTL', 'Trình bày tại hội thảo quốc tế', 'bài', 50, 1, 'CONFERENCE', 1),
	('CONF_PRES_NAT', 'Trình bày tại hội thảo quốc gia', 'bài', 30, 1, 'CONFERENCE', 1),
	('CONF_PRES_ACAD', 'Trình bày tại hội thảo học viện', 'bài', 20, 1, 'CONFERENCE', 1),
	('INTL_WOS', 'Bài báo quốc tế WoS', 'bài', 210, 1, 'INTL_PAPER', 1),
	('INTL_SCOPUS', 'Bài báo quốc tế Scopus', 'bài', 140, 1, 'INTL_PAPER', 1),
	('INTL_ENG_ACAD', 'Bài báo tiếng Anh học viện', 'bài', 70, 1, 'INTL_PAPER', 1),
	('INTL_OTHER', 'Bài báo quốc tế khác', 'bài', 60, 1, 'INTL_PAPER', 1),
	('INTL_CITATION', 'Bài báo được trích dẫn', 'trích dẫn', 1, 1, 'INTL_PAPER', 1),
	('VN_ACADEMY', 'Bài báo tiếng Việt tạp chí học viện', 'bài', 40, 1, 'VN_PAPER', 1),
	('VN_OTHER', 'Bài báo tiếng Việt tạp chí khác', 'bài', 20, 1, 'VN_PAPER', 1),
	('PROC_INTL', 'Bài tham luận kỷ yếu quốc tế (fulltext)', 'bài', 25, 1, 'PROCEEDING', 1),
	('PROC_NAT', 'Bài tham luận kỷ yếu quốc gia (fulltext)', 'bài', 15, 1, 'PROCEEDING', 1),
	('PROC_ACAD', 'Bài tham luận kỷ yếu học viện (fulltext)', 'bài', 10, 1, 'PROCEEDING', 1),
	('REVIEW_PAPER', 'Bài tổng quan lĩnh vực nghiên cứu', 'bài', 10, 1, 'REVIEW', 1),
	('TECH_CONSULT', 'Hoạt động tư vấn / hướng dẫn kỹ thuật', 'sản phẩm', 5, 1, 'TECH_CONSULT', 1),
	('TECH_PROCEDURE', 'Quy trình kỹ thuật / tiến bộ kỹ thuật', 'sản phẩm', 10, 1, 'TECH_PROCEDURE', 1),
	('PROPOSAL_NAT', 'Đề xuất được đưa vào danh mục tuyển chọn cấp quốc gia', 'đề xuất', 10, 1, 'PROPOSAL', 1),
	('PROPOSAL_MINISTRY', 'Đề xuất được đưa vào danh mục cấp bộ/tương đương', 'đề xuất', 5, 1, 'PROPOSAL', 1)
ON DUPLICATE KEY UPDATE
	name = VALUES(name),
	unit = VALUES(unit),
	quota_hours = VALUES(quota_hours),
	is_shareable = VALUES(is_shareable),
	metric_key = VALUES(metric_key),
	is_active = VALUES(is_active);
