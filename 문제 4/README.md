# 문제 4

아래의 요구조건에 맞는 설계를 진행하고, 이유를 설명해주세요

작은 스타트업에서 BO 서비스에서 통계 서비스를 개발하여 합니다

1. 각 콘텐츠의 유저의 클릭수, 좋아요수를 보여주는 그래프를 그려야 합니다
2. 클릭과 좋아요 수는 BO의 대시보드에서 확인이 가능하며, 새로고침 버튼을 눌러서 갱신 가능합니다
3. 그래프는 일일 단위로 합계로 표시됩니다

---
1. 실시간 데이터가 아니기에 sql 기반 쿼리로 설계를 할겁니다.
2. 대시보드에서 확인을 하기에 오픈소스인 Redash 를 써서 시각화 할겁니다.
   만약 실시간성 데이터였으면 kibana 같은 실시간 시각화 오픈소스를 썻겠지만
   갱신형 으로 보고 sql 에 의한 쿼리를 그대로 시각화 하면되기에 현재 요구사항에는
   저는 적합하다고 생각합니다. 만약 규모가 커진다면 데이터 마트를 구축하고 열지향 스토리지
   로 분산처리하여 해야겠지만 현재 요구사항에서는 오버엔지니어링이라 생각합니다.
3. 클릭 및 좋아요 이벤트는 로깅 방식으로 이벤트 기반 db 에 저장 -> 사용자 id, 콘텐츠 id, 이벤트 타입으로 timestamp 를 포함한 데이터 수집

### Diagram
<img src="https://lh3.googleusercontent.com/fife/ALs6j_GYzaA-qgrlKTMBWMqbVlTcC4r1BfrZprjqsqB11cbxaYZ5DIbjnvX-dKI1DfkDRFrFfKYVCwdHOEUKAsObu9PdWXG6N09l7yeTRvMNsluelX_wGPiNMNEZsnXk-pxTaSRnnsmczi8SPMf1VY4dwxOSrR6MgpGOwJO_RzqTSH57VXugdlYrF1H8ekgpqIMXOjhLTtW8pKU2mmR7PU5DHvP1iBBvmOwAmxVG9g2DJu_fvIWgC-zYe5SA_xuBsU92zoOjHzy7N5LSnWsM2qt5toZfWyfv6P8l6m_F1OhXjDd_0tvihV8nmYuNNT2zBFj8qN2zU5i8Aq89IOFjkLfXHPPHn9NgccOILg_rjoZgxO1X7crRAx40UVDYG1WO2uqeQnkmNc05kxIlwfLR4qQJXFU6g_1WTqUnrnDYHbPP3_oicPj4fUXZtjGrnTycwdPfkX2NUI9o9hv9kPDXopCVfSQ8XiV4I3nisGqNX-tzwJ1cD_iN_vqtFEBQEWkt6642jEtw5_Tzfbg0LsNdNfmocDCSJrWKGR9Cgw8SszrYzDyHuOWvbngbOa6NqWpdmk7_wuvqaVupnLB482mvirw0jmUf7IdcAYqJsH42jO2AGVFo6BTBPLMhzUo0kjctQBSETIsfvmcElQVckMgFB_mHsn8l9xPh_Tx9zpEnqlB36SeebujvOYvPARlSLEJrHvRgdHxBy0xIVa_QkguS1OOzzCzZno6sG6E1_qiUKxGVCVhyTzdCFS0rilirA01rouxPAhl20FYD_mtKZgnCNniEkSzLxmiBf0arxkY8BKjVnzucnV_j5nrs6kUso0wjsgdeEOIXzF-kkCW-SFjGfjXdXsliFyKpjaKGfEkuxrTggXphISGHTcPQbzyxwHuqTMqLYYm1hPIPXBi4j6r04EfOrZm5ZGi2MGwgRzzbkIZ0vuAT5XEKScAYlq1pSn31PnW-tai4QUCidezMP3Ov7dJts-RUPXCtM_wD8AXg7pc_OG3YUugGxpxsNJAKvkpAzRTfTQeLKixMTtsDxlfvPvJsjsCmnzI60JXfi5XQJL9UvMOPeRZsjK2yyySBjRnWiMTv4nX43xr8Buz3dBTwVzT4ZibBv33AOdJJWppSiE0DWd5Lb6VuiMNMNknHbgzzFOfvKvCbD9KSO6LAUd5faz2LycDzn6P2C_giIRVaAVRkuAO55CqnLqZaEV1PyQAUFzaeamjL2iDKTYdNALSltPgdlGLqpBAuAT25CJfMNJQf23F0sWPSi4ZmcLCGGYh_bRFy057_XdSn_hLhB7adkU_Vo89G_IMsu8cJ90phetqbrAlyDeBfbKIVrIuWbUMiyASLRCXGo4n96Q7j9g1hZYcqe-qY81TXJYfwqVQjZ6rcFbEyiwMMiQpQ1aV7ISyMeUKQB8Zo75pSrTlEgEerGE1f3eGfnsdDmeTF-oWS-TBegNFbczK_IdJYhgk5tByIoUtpZA18pG9zETeOGMjL-Cf6QlP6055_vzpBjs1CutFVXyDqYL6xT40ojX-lO0n3TvdJt9sKX0IY6qHllXtI9HEoUKPPVRRbo8p3msDtiZas2xb71szOEAO6QHU-18Y5NOMCUc7D79TD=w1920-h934">
   

### 💡 추가질문 1. - 실제로 구현해본 경험이 있다면, 해당 구현 경험을 서술해주세요
         - 간단한 재고 출입고,수불부의 시각화 그래프 경험이 있습니다.
         - 그 당시도 redash 로 연결하여 쿼리 기반으로 시각화하였습니다.
         - 그래프를 보는 비율이 적고 경량화 되어있고 대시보드 기능도 있어 적합했었습니다.

### 💡 추가질문 2. - 유저가 클릭을 조작하기위해 빠르게 연타를 한다면, 어떻게 방지할수 있을까요?
          - 클라이언트 단에서 일단 디바운스처리를 하는것도 중요합니다.
          - 백엔든 애플리케이션 레벨에서는 로그인시만 가능고 토큰기반 로그인이라 가정했을시 요청시도 
            토큰 발급 하고 토큰에 타임스탬프 만료 시간 포함으로 처리하는게 좋다고 생각합니다.
          - DB 레벨에서는 유니크 를 user_id,content_id,date 로 지정해서 설정하는 중복이벤트 차단 할수는 있습니다.
            위에서 처럼 이벤트를 원시 데이터 db 에 저장 하는 방법이 있습니다.
          - 그래서 클라이언트와 백엔드 두가지를 적절히 선택해서 처리하는게 좋다고 생각합니다.
