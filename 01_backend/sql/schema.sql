drop table if exists grades;
drop table if exists users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    student_code TEXT NOT NULL UNIQUE ,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL ,
    phone TEXT,
    major TEXT NOT NULL CHECK(major IN ('CNTT','ATTT','DTVT')),
    class_name TEXT NOT NULl,
    admission_year INTEGER NOT NULL CHECK(admission_year between 2000 and 2100),
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN('student' ,'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN('active' ,'locked')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE grades(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    credits INTEGER NOT NULL CHECK (credits BETWEEN 1 AND 6),
    attempt INTEGER NOT NULL DEFAULT 1 CHECK (attempt >=1),
    score10 NUMERIC(3,1) NOT NULL CHECK (score10 BETWEEN 0 AND 10),
    is_final BOOLEAN NOT NULL DEFAULT FALSE ,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(user_id, course_code , attempt)
);
select *from users;
insert into users(student_code,full_name,email,password_hash,major,class_name,admission_year) values 
('CT090304','Ngô Duy Anh','duyanh@gmail.com' ,'clgpghat','CNTT','CT9C','2024');
INSERT INTO grades (user_id, course_code, course_name, credits, attempt, score10)
VALUES (2, 'CT305', 'Mạng máy tính', 3, 1, 5.5);
INSERT INTO grades (user_id, course_code, course_name, credits, attempt, score10) VALUES
 (1, 'CT305', 'Mạng máy tính', 3, 2, 8.6);
INSERT INTO grades (user_id, course_code, course_name, credits, attempt, score10)
VALUES (1, 'CT305', 'Mạng máy tính', 3, 1, 9.0);
DELETE FROM users WHERE id = 1;
SELECT * FROM grades;