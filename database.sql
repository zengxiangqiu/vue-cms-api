-- Expression Affinity	Column Declared Type
-- TEXT	"TEXT"
-- NUMERIC	"NUM"
-- INTEGER	"INT"
-- REAL	"REAL"
-- BLOB (a.k.a "NONE")	"" (empty string)

Drop TABLE IF EXISTS PostTmp;
-- CREATE TABLE  PostTmp AS SELECT * FROM Post;

Drop table IF EXISTS Category;
Drop table IF EXISTS Post;


CREATE TABLE Category(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

CREATE TABLE Post(
    id INTEGER PRIMARY Key AUTOINCREMENT,
    categoryId INTEGER,
    title TEXT,
    content TEXT,
    author TEXT,
    lastModDate TIMESTAMP DEFAULT CURRENT_DATE,
    
    CONSTRAINT Post_fk_categoryId FOREIGN KEY (categoryId)
    REFERENCES Category (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Entry(
    id INTEGER PRIMARY Key AUTOINCREMENT,
    category TEXT,
    title TEXT,
    content TEXT,
    author TEXT,
    lastModDate TIMESTAMP DEFAULT CURRENT_DATE,
    countOfComments INTEGER,
    excerpt TEXT,
    imgUrl TEXT,
    link TEXT,
    sourceId INTEGER,
    
   CONSTRAINT Entry_fk_categoryId  FOREIGN KEY (category)
   REFERENCES EntryCategoryMaster(key) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE EntryCategoryMaster(
    key TEXT PRIMARY KEY ,
    value TEXT
);

CREATE TABLE EntryTagMaster( 
    key TEXT PRIMARY KEY ,
    value TEXT
);


CREATE TABLE EntryTag(
    id INTEGER PRIMARY Key AUTOINCREMENT,
    entryTagMasterId STRING NOT NULL,
    entryId INTEGER NOT NULL,
    
    CONSTRAINT EntryTag_fk_entryTagMasterId FOREIGN KEY(entryTagMasterId)
    REFERENCES EntryTagMaster(key) ON UPDATE CASCADE ON DELETE CASCADE
    
    CONSTRAINT EntryTag_fk_Entry FOREIGN KEY (entryId)
    REFERENCES Entry(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE EntryMenu(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    m_key TEXT NOT NULL,
    m_type TEXT NOT NULL,
    parentKey TEXT,
    parentType TEXT,
    orderNum INTEGER NOT NULL
);


CREATE TABLE EntryTag(
    id INTEGER PRIMARY Key AUTOINCREMENT,
    entryId INTEGER NOT NULL,
    tagId INTEGER NOT NULL
);


SELECT * FROM Entry  A 
INNER JOIN EntryCategoryMaster B ON A.category = B.key --AND B.value = ''
INNER JOIN EntryTag C ON C.entryId = A.id 
INNER JOIN EntryTagMaster D ON D.key = C.entryTagMasterId --AND D.value = ''



--rename an existing column of a table 
BEGIN TRANSACTION;

CREATE TABLE EntryTagTmp(
    id INTEGER PRIMARY Key AUTOINCREMENT,
    entryId INTEGER NOT NULL,
    entryCategoryMasterId INTEGER NOT NULL
);

INSERT INTO EntryTagTmp(id, entryId, entryCategoryMasterId)
SELECT id, entryId, tagId FROM EntryTag;

DROP TABLE EntryTag;

ALTER TABLE EntryTagTmp RENAME TO EntryTag;

COMMIT;
------end--------------

CREATE TRIGGER [UpdateLastTime]
AFTER UPDATE
ON Post
FOR EACH ROW
BEGIN
UPDATE Post SET lastModDate =  datetime(CURRENT_TIMESTAMP, 'localtime') WHERE id = old.id;
END;


------Entries----------
SELECT * FROM Entry INNER JOIN EntryCategoryMaster ON Entry.category = EntryCategoryMaster.id

------entry with tag and category
SELECT * FROM Entry INNER JOIN EntryCategoryMaster ON Entry.category = EntryCategoryMaster.id AND EntryCategoryMaster.category = 'category'
INNER JOIN EntryTag ON EntryTag.entryId = Entry.id AND EntryTag.category = 'tag'  AND En


----CustomEntries ------------
--imgUrl title link date CountOfcomments

SELECT imgUrl, title, link,lastModDate, countOfComments FROM Entry ORDER BY lastModDate DESC Limit 5;



SELECT * FROM Entry WHERE id in (SELECT DISTINCT  entryId FROM EntryTag WHERE entryCategoryMasterId IN( SELECT id FROM EntryCategoryMaster WHERE key = '' and category =''))

SELECT A. FROM Entry A 
INNER JOIN EntryTag B ON A.id = B.entryId 
INNER JOIN EntryCategoryMaster C ON B.entryCategoryMasterId =  C.id 
WHERE C.key = 'etymology';

--duplicate 
select entry.id from entry left join entrycategorymaster on entry.category = entrycategorymaster.id  left join entrytag on entrytag.entryid = entry.id where entrycategorymaster.id = 10 group by entry.id  having(count(1))>1;


SELECT * FROM Entry A 
INNER JOIN EntryCategoryMaster B ON A.category = B.id AND B.key=''


-- CREATE TABLE Post (id INTEGER PRIMARY KEY, categoryId INTEGER, title TEXT,
-- CONSTRAINT Post_fk_categoryId FOREIGN KEY (categoryId)
-- REFERENCES Category (id) ON UPDATE CASCADE ON DELETE CASCADE);
--SELECT name FROM Category WHERE name = ?
-- INSERT INTO Category(name)VALUES('ORDER'),('DELIVERYNOTE'),('FRANCHISE'),('WH');
-- INSERT INTO Category(name)VALUES('DELIVERYNOTE');
-- INSERT INTO Category(name)VALUES('FRANCHISE');
--UPDATE Category SET name = ? WHERE id = ?

--INSERT INTO Post(categoryId, title,content,author)VALUES(2,'测试','TEXT','秋');
-- INSERT INTO Post(categoryId, title,content,author)VALUES(1,'11','11','秋')
-- INSERT INTO Post SELECT * FROM PostTmp;

-- SELECT * FROM Post WHERE categoryId = ?;
-- UPDATE Post Set title = ?, content = ?, categoryId = ? WHERE id = ?

--SELECT Category.id,COUNT(1) as qty,name as category FROM Post INNER JOIN Category ON categoryId = Category.id GROUP BY Category.id,name;

-- db.run("UPDATE Post Set title = ?, content = ?, categoryId = ? WHERE id = ?", "bar", 2);
