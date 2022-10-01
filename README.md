# SNS 게시판 <br>

* 게시판 관련 rest api 구현

* Api-docs : 'localhost:3000/api-docs'<br>
https://app.swaggerhub.com/apis/POOOHOO/sns-board-service/1.0
<br>

* DB Schema : <br> 

 ![db](https://user-images.githubusercontent.com/81277145/193396283-b6970960-7b89-49ed-be85-d162c2b26594.png)



## 구현 내용
> ! 조회를 제외한 모든 기능은 로그인을 필요로합니다.
<br>

### 1. 유저 생성 (회원가입) <br>
회원가입할 email과 비밀번호를 입력 받아 이미 가입 된 email인지 확인 후, 새로 생성된 유저 id (uuid)를 반환합니다. 이 때 유저가 입력한 비밀번호는 해싱되어 저장됩니다.<br><br>

### 2. 유저 로그인 및 인증

유저가 입력한 값과 DB에 저장되어 있던 유저의 정보가 일치할 경우, JWT형태의 accessToken과 refreshToken을 발급합니다. 보안을 위해 accessToken은 짧은 만료기간을 가지고 클라이언트의 로컬 변수에 저장되며, 
refreshToken은 쿠키에 저장됩니다. 이후 각 토큰의 strategy 및 guard 사용을 통해 api에 대한 권한을 설정하고, payload에 담긴 유저 정보를 사용할 수 있습니다. <br>

![쿠키](https://user-images.githubusercontent.com/81277145/193396925-f0777bab-7bd9-46ad-9a54-a25d452ecb81.png)
<br>
* accessToken이 만료된 경우 restore api를 통해 refreshToken을 검증 한 뒤 새로운 accessToken을 반환합니다.
<br><br>

### 3. 게시글 생성
제목, 내용, 해시태그 등을 입력받아 생성된 board Entity를 반환합니다.

* 201 Response Example :
```
{
  "id": 0,
  "title": "string",
  "content": "string",
  "watched": 0,
  "liked": 0,
  "createdAt": "2022-10-01T07:05:05.556Z",
  "authorEmail": "string",
  "tags": [
    "string", "string"
  ]
}
```
<br>

### 4. 게시글 수정
수정할 게시글의 id와 수정할 값을 입력받아 게시글을 수정합니다. 자신이 작성한 글만 수정 가능합니다.
<br><br>

### 5. 게시글 삭제 및 복구
* delete : 삭제할 게시글의 id를 입력받아 soffDelete 시킵니다. 자신이 작성한 글만 삭제시킬 수 있습니다. <br>
* resotre : 삭제한 게시글의 id를 입력받아 restore 시킵니다. 마찬가지로 작성자만 수행 가능합니다.
<br><br>

### 6. 게시글 조회
조회할 게시글 id를 입력받아 해당 board entity를 반환합니다. <br>작성자를 포함한 사용자가 게시글을 상세보기 하면 조회수(watched)가 1 증가합니다. <br><br>

### 7. 게시글 좋아요
게시글 id를 입력받아 게시글의 좋아요(liked)를 1 증가시킵니다. 이미 좋아요 한 게시글에 다시한번 좋아요 요청을 보내면 좋아요가 취소됩니다. <br>응답 값은 좋아요 처리되었을 때 true / 취소 시 false 입니다. <br><br>

### 8. 게시글 목록 조회
게시글 목록 조회 시 다음 기능들을 위한 Query parameter를 입력 받습니다. <br>
1. 게시글 정렬 순서(내림차순 / 오름차순)
2. 원하는 정렬 값(작성일, 좋아요 수, 조회 수)
3. 게시글 제목 검색
4. 해시태그 필터링
5. 한 페이지 당 받아 볼 게시글 개수
6. 조회할 페이지 <br>

이 중 필수로 요구되는 값은 없으며, 각 parameter의 default 값은 다음과 같습니다.
* 정렬 순서 : 내림차순
* 정렬 값 : 작성일
* 한 페이지 당  게시글 수 : 10
* 페이지 : 1

200 Response Example :
```
[
  {
    "title": "1번 게시글",
    "tags": [
      "#태그1,
      "#태그2
    ],
    "watched": 2,
    "liked": 1,
    "createdAt": "2022-09-28T06:03:16.326Z",
    "authorEmail": "b@b.com"
  },
  {
    "title": "2번 게시글",
    "tags": [],
    "watched": 0,
    "liked": 0,
    "createdAt": "2022-09-27T15:11:15.599Z",
    "authorEmail": "a@a.com"
  },
]
```
