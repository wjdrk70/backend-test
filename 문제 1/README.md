# 문제 1

NestJS 기반의 백엔드 서비스에서 **사용자 등록 API**를 구현하세요.

이 API는 새로운 사용자를 등록하고, 비밀번호를 안전하게 저장해야 합니다.

## 요구사항

**1. API 엔드포인트 -** POST /users

요청 바디 예시

```jsx
{
"name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)",
"password": "securePassword123"
}
```

성공시 응답

```jsx
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-01-21T07:33:37.696Z"
}
```

실패시 응답

```jsx
{
  "statusCode": 409,
  "message": "Email already exists"
}
```

```jsx
{
  "statusCode": 400,
  "message": "Password must be at least 8 characters long"
}
```

**유효성 검사**

- name 필드는 최소 2자 이상, 최대 50자 이내여야 합니다.
- email 필드는 올바른 이메일 형식이어야 합니다.
- password는 최소 8자 이상이어야 하며, 숫자와 문자가 포함되어야 합니다.

**이메일 중복 검사**

- 이미 존재하는 이메일로 회원가입을 시도하면 409 Conflict 응답을 반환해야 합니다.

**비밀번호 해싱**

- 비밀번호를 암호화 하여 안전하게 저장해야 합니다.

**에러 핸들링**

- 입력값이 올바르지 않을 경우 400 Bad Request를 반환해야 합니다.

**데이터베이스 연동 (TypeORM 사용)**

- MySQL을 사용하며, **TypeORM 엔터티**를 정의하여 데이터를 저장해야 합니다.

---
1. Docker 에 db 를 올렸습니다.  **docker compose up -d** 실행
2. resource dir 에 init.sql 파일이 있습니다.
3. service 단의 테스트 코드를 작성하였습니다.



### 💡 추가질문 - 비밀번호 해싱처리는 왜 하는걸까요?
  - 보안을 위해서 합니다 하지만 암호화 와 해싱은 다릅니다.
  - 해싱은 단방향 함수로 원본 데이터를 고정된 길이의 문자열로 변환합니다.
    해당과정은 비가역성이라서 원래 암호를 재구성할수가 없습니다.
  - db 의 해싱된 암호가 털려도 단방향이라 원본을 알수가 없습니다.
  - 그래서 해싱처리를 하는겁니다.
