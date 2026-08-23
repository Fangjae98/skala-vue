# SunMap Weather Platform

## 1. 프로젝트 개요

**SunMap Weather Platform**은 전국 주요 지역의 실시간 날씨를 비교하고, 그 지역이 오늘 태양광 발전에 얼마나 유리한지를 지도로 보여주는 대시보드입니다.

Vue 3 기초 문법 학습 과제 1~6(날씨 카드 목업 → 컴포넌트 분리 → 라우터 → 스토어 → Axios 통신)을 바탕으로, 대시보드로 발전시켰습니다. 과제 결과물은 `/learning` 페이지(학습 내용)에 아카이브해 확인 가능합니다.

- 배포: GitHub Pages — `https://<github-id>.github.io/skala-vue/`

## 2. 주요 기능 및 프로젝트 구조

### 이 프로젝트의 차별점

- **데이터 연동**: 날씨는 OpenWeatherMap, 태양광 발전 등급 판정은 Open-Meteo의 실측 일일
  일사량(MJ/m²)을 사용합니다. 기상청 SI_DAY와 단위가 같은 실측치로 등급을 매깁니다.
- **실사 지형 지도**: SunMap 페이지는 `d3-geo` + `topojson-client`로 실제 한국 지형(Natural Earth TopoJSON)을 투영해 그립니다.
- **실시간 자동 낮/노을/밤 테마**: 태양 고도를 NOAA 근사식으로 계산해 사이트 전체 배색이 실제 시간에 맞춰 바뀝니다.
- **학습 과정의 아카이브화**: 과제 1~6에서 만든 컴포넌트를 확인을 통해 과제 수행 내용을 서비스 콘텐츠로 구성했습니다.
- **CI/CD**: GitHub Actions로 `main` 브랜치에 push할 때마다 자동 빌드 + GitHub Pages 배포.

### 폴더 및 코드 구조

```
src/
├── App.vue                    # 헤더(로고+nav+시계+단위토글) + RouterView 단일 골격
├── main.js
├── router/
│   └── index.js                # /, /weather/:cityId, /sunmap, /learning, /about, 404
├── stores/                     # Pinia
│   ├── configStore.js           # 단위(℃/℉) 전역 상태 — 과제 5
│   ├── themeStore.js            # 라이트/다크 수동 토글 — 과제 5 원본 (현재 화면엔 미사용, 아카이브 보존)
│   ├── sunThemeStore.js         # 태양 고도 기반 실시간 낮/노을/밤 테마 — 개인 추가 기능
│   └── weatherStore.js          # OpenWeatherMap + Open-Meteo 병렬 호출, 지역 데이터 캐시
├── utils/
│   ├── solarPosition.js         # NOAA 근사식 기반 태양 고도/방위각/일출·일몰 계산
│   └── solarGrade.js            # 일사량(MJ/m²) → 발전 등급(우수/보통/미흡) 매핑
├── components/
│   ├── practice/                 # 과제 1~6 결과물 — 지금은 /learning에서 재사용/전시
│   │   ├── original/              # 리팩터링 이전 원본 코드 (과제 4·5 "원본 참고"에 사용)
│   │   ├── WeatherMockup.vue       # 과제 1
│   │   ├── WeatherComposition.vue  # 과제 2
│   │   ├── WeatherParent.vue       # 과제 3
│   │   ├── SearchBar.vue / ChargeFilterBar.vue / WeatherCard.vue / BaseDashboardCard.vue
│   │   ├── UnitToggler.vue / ThemeToggler.vue   # 과제 5
│   │   └── WeatherAxios.vue / AxiosJson.vue     # 과제 6
│   ├── sunmap/                   # 개인 추가 기능 — SunMap 실사 지도
│   │   ├── KoreaMap.vue            # d3-geo 투영 + 태양 위치 기반 낮/밤 배경
│   │   └── RegionMarker.vue        # 지역 마커 (Props Down / Emit Up)
│   └── test/                     # v-if, watch, slot 등 Vue 문법 개별 연습 (30여개, 독립 파일)
└── views/
    ├── WeatherHomeView.vue        # 메인 대시보드 (검색 + 필터 + 지역 카드)
    ├── WeatherDetailView.vue      # 지역 상세
    ├── SunMap.vue                 # 태양광 발전 가능성 지도
    ├── LearningLogView.vue        # 과제 아카이브
    ├── WeatherAboutView.vue       # 서비스 소개
    └── NotFoundView.vue           # 404
```

`WeatherCard`, `SearchBar`, `ChargeFilterBar`, `BaseDashboardCard`는 과제 3에서 분리한 컴포넌트를 그대로 실제 서비스(대시보드)에서도 재사용합니다

## 3. 과제별 구현 내용

### 과제 1. 지역별 일사량, 태양광 발전 우수/미흡 구분 추가

- 파일: `components/practice/WeatherMockup.vue`
- `ref`, `v-for`, `v-if`/`v-else`, 이벤트 바인딩 등 Vue 3 기본 문법으로 날씨 카드 목업을 정적으로 구성
- 지역별 데이터에 `insolation`(일사량) 필드를 두고, 1.5kWh/m² 기준으로 "🔋 태양광 발전 우수" / "🪫 태양광 발전 미흡" 조건부로 렌더링

### 과제 2. 검색 아래 발전 우수/미흡 도시 구분 기능 추가

- 파일: `components/practice/WeatherComposition.vue`
- `computed`로 검색어 기반 목록 필터링(`filteredWeatherList`)을 구현하고, 검색창 바로 아래에 "발전 우수만 보기" / "발전 미흡만 보기" 토글 버튼을 추가해 검색과 등급 필터를 함께 적용
- `watch`/`watchEffect`로 필터 변경 이력을 콘솔에 로그로 남기는 실습 포함

### 과제 3. 검색 부분 컴포넌트 분리

- 파일: `components/practice/WeatherParent.vue` + `SearchBar.vue` / `ChargeFilterBar.vue` /
  `WeatherCard.vue` / `BaseDashboardCard.vue`
- 과제 2까지 한 파일에 몰려있던 검색창, 필터 버튼, 카드 목록을 개별 컴포넌트로 분리
- **Props Down / Emit Up** 패턴 적용 — 부모가 데이터를 `props`로 내려주고, 자식은 `emit`으로 이벤트만 올려보냄.

### 과제 4. 라우터 연결을 통한 프로젝트 화면 기획

- 파일: `router/index.js`
- Vue Router로 새로고침 없는 화면 전환을 구현. 대시보드 / SunMap / 서비스소개 3개 화면을 nav로 연결하였으며, 현재는 6개 라우트로 확장

  | 경로 | 화면 |
  |---|---|
  | `/` | 날씨 대시보드 |
  | `/weather/:cityId` | 지역 상세 |
  | `/sunmap` | SunMap 발전 가능성 지도 |
  | `/learning` | 학습노트(과제 아카이브) |
  | `/about` | 서비스 소개 |
  | `/:pathMatch(.*)*` | 404 |

### 과제 5. 라이트/다크모드 설정 추가 등

- 파일: `stores/themeStore.js` + `components/practice/ThemeToggler.vue`
- Pinia로 테마(라이트/다크) 전역 상태를 관리하고, `watch`로 `<html>` 클래스와 `localStorage`에 효과를 적용. `storeToRefs`로 컴포넌트에서 반응성을 유지한 채 구독
- 같은 방식으로 단위(℃/℉) 전역 상태(`configStore.js` + `UnitToggler.vue`)도 구현
- 수동 라이트/다크 토글은 **태양 고도 기반 자동 테마**로 대체되어 사용중(원본 코드와 컴포넌트는 보존됨)

### 과제 6. Axios 검증 완료

- 파일: `components/practice/WeatherAxios.vue`, `AxiosJson.vue`
- `WeatherAxios.vue`: OpenWeatherMap을 axios로 직접 호출해 실시간 날씨 데이터를 받아오는 통신 검증
- `AxiosJson.vue`: JSONPlaceholder를 대상으로 GET/POST/PUT/DELETE — CRUD 전체 흐름의 axios 통신 패턴 검증

## 4. 개인 추가 기능

- **SunMap 실사 지도** (`components/sunmap/KoreaMap.vue`): `d3-geo`의 Mercator 투영 + `topojson-client`로 world-atlas TopoJSON에서 한반도 인근 지형만 잘라내 SVG로 렌더링. 지역 마커는 위경도를 화면 좌표로 투영해 배치
- **실시간 태양 위치 계산** (`utils/solarPosition.js`): NOAA 근사식으로 특정 시각, 위경도의 태양 고도/방위각/일출, 일몰을 계산하는 함수 유틸을 작성
- **자동 낮/노을/밤 테마** (`stores/sunThemeStore.js`): 위 태양 고도 계산 결과를 3단계(day/dusk/night) 팔레트에 매핑해 `--app-*` CSS 커스텀 프로퍼티를 실시간으로 갱신. 야간에는 다크 스타일전환.
- **실측 일사량 기반 발전 등급** (`utils/solarGrade.js`, `stores/weatherStore.js`): Open-Meteo의 실제 일사량 데이터(MJ/m²)로 일사량 확보, 발전 등급을 구분하여 나타냄
- **GitHub Actions 기반 CI/CD**: `main` push마다 자동으로 빌드하고 GitHub Pages에 배포

## 5. 사용 API, 기능

| API / 데이터 | 용도 | 인증 |
|---|---|---|
| [OpenWeatherMap](https://openweathermap.org/api) Current Weather | 지역별 기온·습도·풍속·구름량·날씨상태 | API 키 필요 (`.env`) |
| [Open-Meteo](https://open-meteo.com/) Forecast (`shortwave_radiation_sum`) | 일일 일사량 합계(MJ/m²) — 태양광 발전 등급 판정 기준 | 키 불필요, CORS 개방 |
| [world-atlas](https://github.com/topojson/world-atlas) (jsdelivr CDN) | 한국 지형 TopoJSON (SunMap 지도) | 키 불필요 |
| [JSONPlaceholder](https://jsonplaceholder.typicode.com/) | 과제 6 CRUD 통신 검증용 더미 API | 키 불필요 |

기술 스택:

- **프레임워크**: Vue 3 (Composition API, `<script setup>`), Vue Router, Pinia
- **UI/통신**: Element Plus, Axios
- **지도**: d3-geo, topojson-client
- **빌드/품질**: Vite, ESLint(+ oxlint), Prettier

## 6. 실행 방법

```sh
npm install
npm run dev      # 개발 서버, http://localhost:5173
npm run build    # 프로덕션 빌드 → dist/
npm run lint     # oxlint + eslint (에러 0 유지)
npm run preview  # 빌드 결과 로컬 미리보기
```

### 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동으로 빌드해 GitHub Pages에
배포합니다.