define({ "api": [
  {
    "type": "get",
    "url": "/api/v1/auth/by-email/:email/exists",
    "title": "이메일 사용 여부",
    "name": "CheckUserWhohasEmail",
    "group": "사용자",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>이메일</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "exists",
            "description": "<p>결과 사용중이면 true 아니면 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 - 사용가능:",
          "content": "HTTP/1.1 200 OK\n{\n\texists: false\n}",
          "type": "json"
        },
        {
          "title": "성공 - 사용중:",
          "content": "HTTP/1.1 200 OK\n{\n\texists: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "사용자"
  },
  {
    "type": "get",
    "url": "/api/v1/auth/by-username/:username/exists",
    "title": "이름 사용 여부",
    "name": "CheckUserWhohasUsername",
    "group": "사용자",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>이름</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "exists",
            "description": "<p>결과 사용중이면 true 아니면 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공 - 사용가능:",
          "content": "HTTP/1.1 200 OK\n{\n\texists: false\n}",
          "type": "json"
        },
        {
          "title": "성공 - 사용중:",
          "content": "HTTP/1.1 200 OK\n{\n\texists: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "사용자"
  },
  {
    "type": "patch",
    "url": "/api/v1/auth/profile",
    "title": "프로필 이미지 업로드",
    "name": "UploadProfileImage",
    "description": "<p>헤더 사용 필수 Content-Type :  multipart/form-data</p>",
    "group": "사용자",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "File",
        "optional": false,
        "field": "image",
        "description": "<p>이미지 파일</p>"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자 토큰</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>결과 true 또는 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tresult: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "사용자"
  },
  {
    "type": "post",
    "url": "/api/v1/auth/new",
    "title": "새 계정 생성",
    "name": "CreateNewUser",
    "group": "인증",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "username",
        "description": "<p>생성할 이름</p>"
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "email",
        "description": "<p>생성할 이메일</p>"
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "password",
        "description": "<p>생성할 비밀번호</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>사용자의 토큰</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\ttoken:\"eyJwe...\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "인증"
  },
  {
    "type": "post",
    "url": "/api/v1/auth/local",
    "title": "로그인",
    "name": "Login",
    "group": "인증",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "email",
        "description": "<p>이메일</p>"
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "password",
        "description": "<p>비밀번호</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>사용자의 토큰</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "username",
            "description": "<p>이름 등록 여부</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "profile",
            "description": "<p>프로필 이미지 등록 여부</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\ttoken:\"eyJwe...\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "인증"
  },
  {
    "type": "patch",
    "url": "/api/v1/auth/password",
    "title": "비밀번호 변경",
    "name": "UpdatePassword",
    "group": "인증",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자 토큰</p>"
          }
        ]
      }
    },
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "currentPasswrod",
        "description": "<p>현재 비밀번호</p>"
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "changePassword",
        "description": "<p>변경할 비밀번호</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>결과 true 또는 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tresult: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "인증"
  },
  {
    "type": "patch",
    "url": "/api/v1/auth/by-username/:username",
    "title": "이름 업데이트",
    "name": "UpdateUsername",
    "group": "인증",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자 토큰</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>업데이트할 이름</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>결과 true 또는 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tresult: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/auth/auth.controller.js",
    "groupTitle": "인증"
  },
  {
    "type": "get",
    "url": "/api/v1/posts/post",
    "title": "게시글 가져오기",
    "name": "GetPost",
    "group": "포스트(게시판)",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자 토큰</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List",
            "optional": false,
            "field": "posts",
            "description": "<p>포스트 객체 리스트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "\tHTTP/1.1 200 OK\n\t{\n\t\tresult: [\n\t\t\t...\n \t\t]\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/posts/posts.controller.js",
    "groupTitle": "포스트(게시판)"
  },
  {
    "type": "get",
    "url": "/api/v1/posts/post/:keyword",
    "title": "타이틀에 keyword가 포함된 게시글 가져오기",
    "name": "GetPostByKeyword",
    "group": "포스트(게시판)",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyword",
            "description": "<p>키워드</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자 토큰</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "List",
            "optional": false,
            "field": "posts",
            "description": "<p>포스트 객체 리스트</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "\tHTTP/1.1 200 OK\n\t{\n\t\tresult: [\n\t\t\t...\n \t\t]\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/posts/posts.controller.js",
    "groupTitle": "포스트(게시판)"
  },
  {
    "type": "post",
    "url": "/api/v1/posts/post",
    "title": "포스트 게시글 업로드",
    "name": "UploadPost",
    "group": "포스트(게시판)",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "title",
        "description": "<p>타이틀</p>"
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "text",
        "description": "<p>텍스트</p>"
      },
      {
        "group": "Body",
        "type": "String",
        "optional": false,
        "field": "photo",
        "description": "<p>올릴 이미지의 ID값</p>"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자 토큰</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>결과 true 또는 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tresult: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/posts/posts.controller.js",
    "groupTitle": "포스트(게시판)"
  },
  {
    "type": "post",
    "url": "/api/v1/posts/image",
    "title": "포스트 이미지 업로드",
    "name": "UploadPostImage",
    "description": "<p>헤더 사용 필수 Content-Type :  multipart/form-data</p>",
    "group": "포스트(게시판)",
    "version": "1.0.0",
    "body": [
      {
        "group": "Body",
        "type": "File",
        "optional": false,
        "field": "image",
        "description": "<p>이미지 파일</p>"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>사용자 토큰</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result",
            "description": "<p>결과 true 또는 false</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "성공:",
          "content": "HTTP/1.1 200 OK\n{\n\tresult: true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "토큰 만료:",
          "content": "HTTP/1.1 419\n{\n \tcode: 5\n\terror: \"Token Expired\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/posts/posts.controller.js",
    "groupTitle": "포스트(게시판)"
  }
] });
