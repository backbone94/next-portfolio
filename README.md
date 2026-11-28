# 🌐 포트폴리오 사이트

## 📖 프로젝트 소개 (Project Overview)

[기존 포트폴리오](https://github.com/backbone94/portfolio) 프로젝트를 리뉴얼하였습니다.

기존 포트폴리오 사이트는 HTML, CSS, JavaScript로 개발되어 반응형 디자인이 구현되지 않아 모바일에서 디자인이 깨지는 문제가 있었습니다.

이번 리뉴얼을 통해 Next.js와 Tailwind CSS를 사용하여 반응형 디자인을 완벽하게 구현하였으며, 모바일에서도 깨지지 않는 UI를 제공합니다.

또한 추후 사이트의 확장 가능성을 고려하여, 최적화 및 성능 부분에서 비교적 우위를 가지고 있는 Next.js 프레임워크를 활용하여 진행하였습니다.

## 🌍 웹사이트

포트폴리오 사이트는 Vercel를 통해 배포되었으며, 다음 URL에서 확인할 수 있습니다:

**[https://leejj.dev](https://leejj.dev)**

## 방문 통계 배포

기존 운영 DB에서는 이 기능을 배포하기 전에 Neon SQL Editor에서 [db/visit_tracking.sql](db/visit_tracking.sql)을 실행합니다.
자치구 공유 기능을 배포하기 전에는 [db/visit_location.sql](db/visit_location.sql)을 적용합니다.
새 DB를 만들 때는 `node --env-file=.env.local db/init.mjs`를 실행합니다.

운영 관리자 화면에 휴대폰 브라우저로 로그인하면 그 브라우저의 방문과 질문을 이후부터 제외합니다.
집 와이파이에서는 **현재 네트워크 제외**를 눌러 접속 중인 외부 회선 주소를 등록합니다.
주소가 다른 브라우저에서는 그 브라우저로 로그인하거나 해당 주소를 따로 등록합니다.

## 📚 기술 스택

![Next.js](https://img.shields.io/badge/Next.js-FFFFFF?style=for-the-badge&logo=next.js&logoColor=000000)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
