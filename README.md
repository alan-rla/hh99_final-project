# D'oh - 실시간 도시데이터 제공 서비스

![IMG_0096](https://user-images.githubusercontent.com/110752019/220834388-55ecb40e-ca38-4173-afde-9c71670a16ae.jpg)

![01](https://user-images.githubusercontent.com/110752019/220834585-e6b01172-aa21-47e9-ab0d-05464b2686d5.png)

서울시에서 제공하는 오픈 API와 머신러닝을 활용해 서울시 50개 주요 지역의 인구혼잡도 예측과 실시간 생활 정보를 제공하는 서비스입니다.

![02](https://user-images.githubusercontent.com/110752019/220834765-90b79d30-9a37-4344-99e4-8a9c0b33622d.png)
![03](https://user-images.githubusercontent.com/110752019/220834770-296c3bb2-9055-4c0e-851c-667a1fb9d380.png)
![04](https://user-images.githubusercontent.com/110752019/220834778-64698957-ff07-4a44-9228-a03fa3fa2c81.png)
![05](https://user-images.githubusercontent.com/110752019/220834783-c422a2e7-b44b-434f-bf0c-a9ce989a254b.png)

# 프로젝트 소개

## 팀 노션

[팀 워크스페이스 바로가기](https://itsjustpeterparker.notion.site/D-oh-by-Claudia-4afd4d4823df4319a2bae7e942a6dd7a)

## 활용한 오픈 API

[서울시 실시간 도시데이터](https://data.seoul.go.kr/dataList/OA-21285/A/1/datasetView.do)

[서울시 실시간 자치구별 대기환경 현황](http://data.seoul.go.kr/dataList/OA-1200/A/1/datasetView.do)

## 기술 도입 배경과 의사결정

1. **Redis**

- 요구 사항 및 문제
  - 도시데이터 API의 매우 느린 응답 속도 (한 지역에 대한 응답 속도 : 2000~4000ms)
  - 도시데이터 API에서 제공되는 50개지역 약 70,000개의 데이터 실시간으로 반복적으로 읽기
- 대안
  - DB사용 (mongoDB 등)
  - Memcached
- 의사결정
  - 대량의 실시간 데이터를 반복적으로 읽어야하기 때문에 매번 데이터베이스에 저장, 업데이트하는것은 성능, 비용 측면에서 매우 비효율적
  - 위치기반 데이터 타입 등 여러 데이터 타입 핸들링, 좋아요 처리, 인증 토큰 저장 등 여러 사용처가 있어 문자열만 지원하는 Memcahced 대비 Redis가 사용에 용이
  - 서비스 확장시 Redis pub/sub을 통해 실시간 알림 기능을 사용할 수 있음
  - Redis는 RDB 혹은 AOF 기반으로 데이터를 저장 가능하고 추후 인구 예측 머신 러닝에 사용할 인구 기록을 저장할 수 있음

2. Elasticache

- 요구 사항 및 문제
  - EC2 서버 로컬 환경에서 Redis 설치 및 활용이 가능하나 서버의 리소스를 소모함
  - EC2 로컬 Redis 가동 중 외부 IP에서 flushall 공격이 주기적으로 들어와 Redis에 저장된 데이터가 사라짐을 확인
    ![중국IP 공격](https://user-images.githubusercontent.com/110752019/220836241-673b6cbc-3ba3-423e-aaf9-2a41ba831471.png)
  - Redis에 캐싱시켜둔 데이터의 손실 우려
- 대안
  - Redis-server
- 의사결정
  - BE 서버를 EC2로 구동시키므로 Elasticache의 구축 및 연결이 편리함
  - Elasticache는 자동 scale-up을 지원
  - Redis-server는 RESP 프로토콜을 사용하지만 인터넷에 직접 노출 됐을때 별다른 보안을 제공하지 않음
  - ElastiCache는 Role-Based Access Control (RBAC)를 지원해 더 나은 보안을 제공
  - EC2 로컬 Redis 대신 외부 IP 공격을 차단할 수 있는 ElastiCache를 사용

3. Beanstalk

- 요구 사항 및 문제
  - 서버에서 개발된 웹 어플리케이션 및 서비스를 간편하게 배포하고 조정하기 위함
- 대안
  - Elastic Beanstalk
  - EC2
- 의사 결정
  - 인프라나 리소스 관리 지점이 적어진다.
  - 오토 스케일링 설정을 사용하여 어플리케이션의 특정 요건에 따라 자동으로 확장, 축소
  - 개발자의 생산성 향상
  - 어플리케이션을 실행하는 AWS 리소스를 완벽하게 제어할 수 있다

# 아키텍쳐

![06](https://user-images.githubusercontent.com/110752019/220838351-4b8465f7-62aa-4313-9e02-392f2eec9083.png)

# 기술스택

| 분류      | 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Language  | <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>&nbsp;<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue"/>&nbsp;                                                                                                |
| Framework | <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Numpy-777BB4?style=for-the-badge&logo=numpy&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Pandas-2C2D72?style=for-the-badge&logo=pandas&logoColor=white"/>&nbsp; |
| DB        | <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/redis-CC0000.svg?&style=for-the-badge&logo=redis&logoColor=white"/>&nbsp;<img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" title="TypeORM" alt="TypeORM" width="80" height="37"/>&nbsp;                                                                                |
| Server    | <img src="https://user-images.githubusercontent.com/110752019/220839528-0fbf359c-4544-4883-ab4f-8ec5676bbc93.svg"/>&nbsp;![Amazon S3](https://img.shields.io/static/v1?style=for-the-badge&message=Amazon+S3&color=569A31&logo=Amazon+S3&logoColor=FFFFFF&label=) <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"/>&nbsp;                                                                          |

# 기술적인 도전 및 트러블 슈팅

1. Redis를 통한 API 응답속도 개선

- 목표
  - 도시데이터 API의 느린 응답 속도를 Redis 캐싱을 통해 개선
- 배경
  - 해당 API는 한 지역(eg. 강남역)에 관한 대량의 데이터를 전송
  - 사용하고자 하는 서울시 내 지역의 갯수는 50개
  - 한 지역에 대한 응답 시간은 2~4초이며 서버 상태에 따라 자주 느려짐
- 해결 과정

  - 해당 API 호출을 위한 URL은 지역명을 직접 입력해야 하므로 반복문을 통해 한번씩 호출
  - 테스팅 용도로 각 기능 정보 캐싱 후 호출 속도를 비교한 결과 속도에 큰 개선이 있음을 확인

    | 기능              | 캐싱전 (5회 평균, ms) | 캐싱 후(5회 평균, ms) | 개선 % |
    | ----------------- | --------------------- | --------------------- | ------ |
    | 인구              | 4106                  | 7                     | 99.82  |
    | 도로              | 2352                  | 3.4                   | 99.86  |
    | 버스 (1구역 기준) | 2134                  | 7.1                   | 99.67  |

2. Redis 캐싱 속도 개선

- 문제점
  - 도시데이터 API를 한번에 하나씩 호출해 캐싱하는 경우 캐싱 시간이 3~4분정도 소요되 데이터 정확성이 의심됨
- 해결 과정
  - 복수의 인증키 + 하나의 인증키로 여러 지역 동시 호출을 진행
  - 한개의 인증키로 과다한 요청을 보낼 시 중복 요청 에러가 발생하나 5개 지역의 호출까지는 보통 문제 없음을 확인
  - 5개 인증키 X 5개 지역, 총 25개 지역을 Promise.all로 동시 호출
  - API 동시 호출 시 응답 속도가 느려져 약 1분 소요
  - 캐싱 속도를 더 개선하기 위해 인구, 도로, 날씨, 대기환경, 버스 정보 등의 캐싱도 Promise.all로 진행
    ![07](https://user-images.githubusercontent.com/110752019/220841649-38f15b5c-9e01-47de-8472-4a36b903f68d.png)

3. Redis 캐싱 전략 도입

- 문제점
  - 간헐적인 응답값 부재
    - 도시데이터 API: 응답값 자체가 없거나, 도로/날씨등 일부 정보가 없거나, 날씨 정보 값 일부가 ‘점검중’으로 출력
    - 대기환경 API: 오염물질 값이 간헐적으로 ‘점검중’으로 출력됨
  - 캐시에 데이터 없을 시 필요한 정보를 조회할 DB 부재
  - 서비스 핵심인 실시간 데이터 제공에 필요한 정확도 높은 데이터 전달에 차질이 생김.
- 해결방법:
  - 대기환경 API는 1시간마다 저장 + 읽음 빈도가 많음 + 데이터 유실이 간헐적으로 발생: Look Aside - Write Through 채택
    - 응답 값이 정상적일 경우 Redis + MySQL 동시 저장 (아닐 경우 저장하지 않음)
    - FE에서 대기정보 호출 시 캐싱된 데이터 없는 경우 DB에서 데이터 호출 및 응답
    - DB 응답값을 호출과 동시에 캐싱시켜 다음번 호출은 빠르게 반환할 수 있게 설정
  - 도시데이터 API는 5분마다 캐싱 + 읽기가 많음 + 간헐적으로 데이터 유실 발생함
    - 5분 간격으로 다량의 데이터를 DB에 계속 저장시키는 것은 비효율적
    - 해당 API 응답 자체가 없는 경우가 있어 5분마다 캐싱 시도를 하는것이고 실제 도시데이터 인구 자료의 갱신은 30분 이상 밀리는 경우도 확인: 5분마다 캐싱하고 15분마다 DB에 백업하는 Look Aside - Write Back채택
    - 호출 로직은 대기환경 API와 동일
- 결과:
  - 캐시 없을 시 (DB 호출 및 응답, 캐싱 시간 포함) vs 캐시 있을 때 호출 시간 비교
  - 전체 정보는 인구, 날씨, 대기환경, 도로 정보를 전부 호출해 캐시 여부에 따라 호출 속도에 큰 차이가 있음
  - 인구는 캐싱된 데이터 외에도 다음 12시간 예상 인구 정보를 다른 테이블에서 호출하므로 비교적 오래 걸림
  - 날씨와 대기환경은 예상한대로 속도 차이가 있음
    ![08](https://user-images.githubusercontent.com/110752019/220842117-bf063d90-e588-4275-be15-98cda53f8699.png)

4. 인구 예측 시계열 분석

- 목표
  - 시계열 예측으로 한 지역의 다음 12시간 동안의 예상 인구 출력
  - AWS Forecast와 파이썬으로 머신러닝 투트랙으로 진행
- 문제점: 서울 생활이동 데이터에서 제공하는 데이터의 형식이 원하는 머신 러닝에 적합하지 않음
  - 도시데이터 API의 주요 50개 지역중 많은 지역이 여러 행정동에 걸쳐있음
  - 인구 이동을 타임스탬프(YYYY-MM-DD HH:MM:SS)로 제공하는것이 아닌 해당 달의 요일별/시간으로 분류해둠
  - AWS Forecast 는 예측하고자 하는 기간 대비 4배 이상의 데이터가 필수이며 반복 학습 진행시 예상 비용 약 50만원으로 해당 방법은 폐기
  - 파이썬으로 진행하는 시계열 분석도 같은 데이터 형태의 문제점으로 신경망 사용이 불가하여 딥러닝 적용 불가
- 해결방안: 데이터 정제 및 사용 전략 변경
  - as-is: 이전 시간대의 이동인구 및 관련 변수로 특정 연/월/시간의 이동인구 예측
  - to-be: 전월의 같은 시간, 요일 대의 이동 인구 및 관련 변수 로 예측
  - 도시데이터의 주요 50개 지역을 생활 이동데이터의 자치구, 행정동 단위로 라벨링
- 결과
  - 서울 생활이동 데이터 22년 11월까지 제공되어 예측 데이터를 이용해 23년 2월 데이터까지 예측 가능
  - 데이터가 많을 수록 더 길게 예측 가능

# 팀원

| 이름   | 포지션   | Github                                |
| ------ | -------- | ------------------------------------- |
| 김수영 | BackEnd  | https://github.com/alan-rla           |
| 백수빈 | BackEnd  | https://github.com/baeksbs3           |
| 조철희 | BackEnd  | https://github.com/chocheolhee        |
| 박민수 | FrontEnd | https://github.com/itsjustpeterparker |
