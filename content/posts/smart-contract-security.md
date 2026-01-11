# 스마트 컨트랙트 보안 취약점 분석

스마트 컨트랙트의 주요 보안 취약점 패턴과 방어 기법을 다룹니다.

## 개요

스마트 컨트랙트는 한 번 배포되면 수정이 불가능하기 때문에, 배포 전 철저한 보안 검토가 필수적입니다.

## 주요 취약점 패턴

### 1. Reentrancy Attack

가장 유명한 취약점으로, The DAO 해킹에서 사용되었습니다.

```solidity
// 취약한 코드
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount;  // 상태 변경이 외부 호출 이후!
}
```

### 2. Integer Overflow/Underflow

Solidity 0.8.0 이전 버전에서 발생할 수 있는 취약점입니다.

```solidity
// uint8 max is 255
uint8 balance = 255;
balance += 1;  // 0이 됨!
```

### 3. Front-Running

블록체인의 투명성을 악용한 공격입니다. mempool에서 대기 중인 트랜잭션을 보고 먼저 유리한 트랜잭션을 제출합니다.

## 방어 기법

1. **Checks-Effects-Interactions 패턴** 적용
2. **ReentrancyGuard** 사용
3. **SafeMath** 라이브러리 활용 (0.8.0 이전)
4. 정기적인 **Security Audit** 수행

## 결론

스마트 컨트랙트 보안은 블록체인 생태계의 신뢰를 위해 필수적입니다. 항상 최신 보안 패턴을 학습하고 적용해야 합니다.
