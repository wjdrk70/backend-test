# 문제 3

사내에서 쓰이는 BO(Back office) 서비스를 개발하려고 합니다.

1. 로그인방식인 OAuth와 JWT 둘중에 어느것을 사용하여 개발을 하실건가요?
2. 둘중 선택한 이유와 장점에 대해 설명해주세요
3. 구현 방법을 서술해 주세요 (다이어그램등을 활용하셔서 첨부하셔도 좋습니다)

---
1. Oauth는 인증/인가 프로토콜이고 jwt 는 토큰 포맷이라서 결국 사용하려면 oauth2.0 프레임워크를 사용해야하고
   구현시 auth server 와 resource 서버 모두 구현해야합니다. access token 발급 할때 jwt 를 사용하여 발급하는 방법으로
   두가지 다 사용하는게 보안 관점에서는 좋기는합니다 하지만 백오피스 시스템이기 때문에 JWT 만 사용할거 같습니다.

2. jwt 는 사용자 검증 처리 서버 호출 과정없이 public key 를 사용해서 token signature 를 하기 때문에
   로컬에서 자체적으로 유효성 검사를 할수 있어어 사용자 정보,클레임 정보가 토큰내부에 저장되서 사용자정보 만료시간 토큰서명 등을 로컬로 검증가능합니다. 
   그래서 백오피스 시스템에서는 빠른 토큰검증이 나을거라는 생각에 저는 JWT 토큰 포맷을 이용할거 같습니다.

3. <br /> 
<img src="https://lh3.googleusercontent.com/fife/ALs6j_EsrHxPaQ8KqLNsAwer7Y2PtG_HjZ-Eknsu3pk8gAOSbiZa6WClHK2IA3BuZQUsKhl1SM-Q8zVNJTDhtoeoF_zpQ324ZtG_kG_i6gW5NmDmAL_5uQ1TuxCMW7LEISrxYmIuEQCfVGV-r7qXocUberLbWarfuiLIdOfVqysdTxNsuaM3kzefd9WZp5Vu7jLZXLa2p8K4fp2gJplPWcY4DeW5DUqXwrrOetTQJdrdPJc6SPX03_iivrboFya8NT54HEnQUTkT0xLhmM4HOTfPUw2reJ6o7o0xSFmJZzmoLy8mqxhxI1khELFM8l79_IIoJKE8NF8Qxus-oy7BbwPOlBINZn4PXjiP38tDpNPVruJM1AmDHH4rJM-IYrwfZKwayUZYVl_L37QL8eR3oEV3L8wFAqAWHBjSY6SLpoxHmplb0s9CCB1nB2FZWlAZ8bsn0xkkbUqpglkAK5jAesgJtTjzuL4HvjyTXGosuZFFH-JLioNnFnUcrS3ljx2BgLV-vDRv6q7cgpVDrshs3fDnpbHizQ0tunLWxHj_4LqldBUUP5T5NzozyTgFE70LEmzeJmqy4yHN2VSgxY-c5icziDF3DOs20fciq_5OpATHfCKWckG84t1_99fFNQ-JxVk-UKB2GiCI9JAumtaRomaty40IBidPbnNhUP6rPvSE4jGJHPoe1RCGaRSek2tzPaMLyQWa2iBH_IzkXqcSJfYILYjS--oTxRz2aU-gjpjB4IsPVXkcPpupVkOnJDR8190zoGtQeWLl8o5sM42bBnp6uKSoi5QYQ-7C_Nei5V8W-PSftLvK6E7jEu26b6VDekvHPqZfdhaBRvRlRDYBCQxHILiEfEogFYu88zkNV-izCNxqM-usi1TG73hk5OfT0vEglWo5ylaC6q17Y9jLAeHN4Hput_C0Rk1myFez6H4gltUS1QfwqwOWl2ggpWMe9-WrcyWFsDo0LiTbeYF6FkCn6iAAkgBnaUagfMRf_ljzzLqcROQ06TUA5RH5fRnRauX9zbTjZrNv6DO4-1qE_YqDpMhl1GJZjVi5f0qO0kJK60Vg3nuri-qMvray7j3-Y3xXhE-JV_TMejNRluIyNaX9XHNEodo3KCGk9qnSyCTGn8prOj-WzmvQDDRSRmdkZxXB67aPv1UvwMYnR6pgnwJKcDTVtpiVGrX3tgw1TSAMvUowIT5QTRUkM26O83Qnjf1AX5sRWSIQf2LPFX0-6St45fvBesFft6CXsUhzBuVO3zckfQO4KreEgZuwa72ncUBVLEyxpyZcUf8tVnaRRVN5Ozm3xXCQIh1GJWhImV8kfmqZQFerljqNI0O6a5Jk4adLJ0kG4Jk-mDwOyZ1haH1T-GFei7_2d8NIEKHsAfIxr4zo7vQ0dxyzqtHr1xufLqlbcHZ4uJFi1_WoAF-jDYxNEX0xo_-zTcBoIpCcPgRZUDdTb2mX-IDrI-_iCCqrI2bqXdf4J8B5BznHrwVw5D4vYNDHOZqnFKf-oKTAv2Gw7sUNfhIYc2tkBRUqwn8JLetrq2NvR8y8fURn8-p6pawI307cNuhEbHbNXD2I8GsMRRyhV0NVHgkSWlywvxHiq7McGpIvSlHtOg=w1024-h1006">   




### 💡 추가질문 - 실제로 구현해본 경험이 있다면, 해당 구현 경험을 서술해주세요
    - 위에 설명대로 oauth2 에서 spring security 에서 auth 와 resuource server 를 구현하고
      jwt 를 access token,refresh token 을 발급 하는 방식으로 구현했었습니다.
      
    -  refresh token 관리를 위해 데이터베이스에 토큰 정보를 저장했습니다. 
       각 refresh token의 jti(JWT ID)를 기본 키로 사용하고, 사용자 ID, 발급 시간, 만료 시간, 사용 여부 등의 메타데이터를 함께 저장했습니다

    - 사용자 로그아웃 시 해당 사용자의 모든 리프레시 토큰 무효화

    - 비밀번호 변경 시 자동으로 모든 세션 종료

