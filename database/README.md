
```
bq mk test_123
bq show test_123
bq load --source_format=CSV --skip_leading_rows=1 test_123.albums albums.csv  title:string,artist:string,price:numeric
bq load --source_format=CSV --skip_leading_rows=1 test_123.instruments instruments.csv  kind:string,specifics:string
bq load --source_format=CSV --skip_leading_rows=1 test_123.likes likes.csv  instrument_kind:string,post_id:integer
bq load --source_format=CSV --skip_leading_rows=1 test_123.posts posts.csv  id:integer,instrument_kind:string



Construct a SQL query that return the titles of albums that can are priced greater than the average price of the albums of the artist. 

SELECT title, price FROM test_123.albums T 
WHERE price >
(SELECT averages FROM
  (SELECT AVG(price)
    AS averages, artist AS art from `acto-su-1.test_123.albums` GROUP BY artist)
   AS artists WHERE artist = art)

Construct a SQL query that returns the kinds of instruments and number of likes each kind got, in total, for all of the posts

SELECT COUNT(id), posts.instrument_kind FROM test_123.posts INNER JOIN test_123.likes ON post_id=id GROUP BY posts.instrument_kind;

Construct a SQL query that returns specifics of instruments and post id for each of the likes.

SELECT specifics, post_id FROM test_123.instruments INNER JOIN test_123.likes ON kind=instrument_kind

Construct a SQL query that returns the average number of likes per post for each instrument specifics.

SELECT specifics, AVG(total_likes)
FROM (
    SELECT
       specifics,
       COUNT(specifics) total_likes
    FROM test_123.instruments inst
    JOIN test_123.posts p ON p.instrument_kind = inst.kind
    JOIN test_123.likes l on l.post_id = p.id
    GROUP BY 
       p.id,
       inst.specifics
) AS Q1
GROUP BY specifics;
```