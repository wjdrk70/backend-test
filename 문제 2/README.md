# 문제 2

아래의 요구 사항에 맞는 테이블을 설계하여 ERD를 작성해 주세요

기초 테이블 정의를 바탕으로 작성하며,
유저스토리에 따라 테이블의 수정 및 추가를 하실 수 있습니다

## 기초 테이블 정의

- **user** table은 이름(name), 이메일(email), 패스워드(password), 가입일(created_at)을 가지고 있다.
- **post** table은 글제목(title), 본문(content), 글 작성일(created_at), 작성자(user_id)를 가지고 있다
- **tag** table은 태그명(name), 태그 생성일(created_at)을 가지고있다

### 유저 스토리

- user는 post를 작성할수 있다
- user는 post는 복수의 tag를 추가 할수있다
- user는 탈퇴처리 처리가 가능해야한다
- user가 탈퇴 되더라도, post는 삭제되서는 안된다
- tag로 post를 검색할수 있어야 한다

---
### ERD 설계
```sql
CREATE TABLE user
(
    user_id    int auto_increment primary key,
    name       varchar(50)  not null,
    email      varchar(100) not null unique,
    password   varchar(100) not null,
    is_delete  boolean default true not null, 
    created_at timestamp DEFAULT CURRENT_TIMESTAMP null,
    deleted_at timestamp null 
);

CREATE TABLE post
(
    post_id    int auto_increment primary key,
    title      varchar(100) not null, 
    content    text not null, 
    user_id    int not null,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP null,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE tag
(
    tag_id     int auto_increment primary key,
    name       varchar(50) not null unique, 
    created_at timestamp DEFAULT CURRENT_TIMESTAMP null
);

-- N:M 관계를 위한 연결 테이블 추가
CREATE TABLE post_tag
(
    post_id    int not null,
    tag_id     int not null,
    PRIMARY KEY (post_id, tag_id), 
    FOREIGN KEY (post_id) REFERENCES post(post_id),
    FOREIGN KEY (tag_id) REFERENCES tag(tag_id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP null
);
```
### 설계 목표
1. 데이터 무결성(사용자 탈퇴 시에도 게시글 보존)
2. post,tag 간의 N:M 관계 post_tag 구현 복합 기본키로 중복방지
3. tag.name에 유니크 추가 하여 중복 태그 방지 ,태그기반 검색을 위한 인덱싱 용이


### 💡 추가질문 - 성능을 개선하기 위한 아이디어를 제시해 주세요
1. 성능목표가 무엇이냐에 따라 다릅니다.
2. 게시글의 조회 tps가 늘어나면 master/slave 구조로 쿼리 분산을 할겁니다.
3. 하지만 대용량 tps 즉 100M tps 이상으로 가게되면 파티셔닝 을 하고 range 로 시계열 데이터를 파티셔닝 할겁니다.
   실제로 파티셔닝시 range 파티셔닝 + 구현화 뷰 로 쿼리성능을 단축시켰습니다.
4. 또 다른 방법은 Nosql 이나 캐쉬 스토리지를 써서 조회를 처리하는겁니다. 
   실제로 카산드라로 Query Service 를 분리 하여 CQRS Pattern 을 도입하여 처리시 대용량 트래픽 처리가 가능했습니다.
