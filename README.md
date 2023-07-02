# BE_NodeJS

middle ware

C:\Users\DELL>mysql -u root -p
Enter password: ************
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.32 MySQL Community Server - GPL

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
 
   
Đã gửi 2 giờ

mysql> use vote_feature
Database changed
mysql> show tables;
+------------------------+
| Tables_in_vote_feature |
+------------------------+
| options                |
| polls                  |
| useroption             |
| users                  |
+------------------------+
4 rows in set (0.02 sec)

mysql> select * from options
    -> ;
+----+------------+-------+--------+
| id | voteOption | count | voteId |
+----+------------+-------+--------+
| 11 | JavaScript |     0 |      7 |
| 12 | Python     |     0 |      7 |
| 13 | Java       |     0 |      7 |
+----+------------+-------+--------+
3 rows in set (0.02 sec)

mysql> select * from users;
+----+-----------------------+---------------------+--------------+
| id | full_name             | createdAt           | country_code |
+----+-----------------------+---------------------+--------------+
|  1 | Nguyen Thi Minh Nguyet| 2023-06-18 17:24:35 |            1 |
|  2 | Nguyen Thi Minh Nguyet| 2023-06-18 17:24:35 |            2 |
|  3 | Nguyen Thi Minh Nguyet| 2023-06-18 17:24:35 |            3 |
+----+-----------------------+---------------------+--------------+
3 rows in set (0.01 sec)

polls (id, voteTitle, voteQuestion, createdAt, createBy)
CREATE TABLE polls (id INT PRIMARY KEY, voteTitle TEXT, voteQuestion TEXT, createdAt TIMESTAMP,createBy INT,FOREIGN KEY (createBy) REFERENCES users(id));

CREATE TABLE permissions (id INT PRIMARY KEY, name VARCHAR(255));

options(id, voteOption, count, voteId)
CREATE TABLE options (id INT PRIMARY KEY, voteOption TEXT,count INT,voteId INT,FOREIGN KEY (voteId) REFERENCES polls(id));


useroption(voteOptionId,votedBy)
 CREATE TABLE useroption ( voteOptionId INT,votedBy INT,FOREIGN KEY (voteOptionId) REFERENCES options(id),FOREIGN KEY (votedBy) REFERENCES users(id));

INSERT INTO polls (id, voteTitle, voteQuestion, createdAt, createBy) VALUES (7,'Favorite Programming Language','What is your favorite programming language?','2023-06-18 19:38:05',1);

INSERT INTO options(id, voteOption, count, voteId) VALUES (13,'Java',0,7);

mysql> select * from polls;
+----+-------------------------------+---------------------------------------------+---------------------+----------+
| id | voteTitle                     | voteQuestion                                | createdAt           | createBy |
+----+-------------------------------+---------------------------------------------+---------------------+----------+
|  7 | Favorite Programming Language | What is your favorite programming language? | 2023-06-18 19:38:05 |        1 |
+----+-------------------------------+---------------------------------------------+---------------------+----------+
1 row in set (0.01 sec)

mysql> select * from useroption;
Empty set (0.01 sec)

mysql>