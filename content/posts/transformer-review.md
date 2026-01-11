# Attention Is All You Need 논문 리뷰

Transformer 아키텍처의 핵심 개념과 Self-Attention 메커니즘에 대한 상세 분석입니다.

## 소개

"Attention Is All You Need" 논문은 2017년 Google에서 발표한 획기적인 논문으로, 현재 NLP 분야를 지배하고 있는 **Transformer** 아키텍처를 소개했습니다.

## 핵심 아이디어

기존의 시퀀스 모델링 방식(RNN, LSTM)의 한계를 극복하고, **Self-Attention** 메커니즘만으로 시퀀스 데이터를 처리합니다.

### Self-Attention 수식

Attention 함수는 Query, Key, Value의 dot product로 계산됩니다:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

여기서 $d_k$는 Key 벡터의 차원입니다.

## 코드 예시

Python으로 Self-Attention을 간단히 구현하면:

```python
import torch
import torch.nn.functional as F
import math

def self_attention(query, key, value):
    d_k = query.size(-1)
    scores = torch.matmul(query, key.transpose(-2, -1)) / math.sqrt(d_k)
    attention_weights = F.softmax(scores, dim=-1)
    return torch.matmul(attention_weights, value)
```

## 주요 장점

1. **병렬 처리** - RNN과 달리 시퀀스를 한 번에 처리
2. **장거리 의존성** - 긴 시퀀스에서도 정보 손실 최소화
3. **해석 가능성** - Attention 가중치로 모델 해석 가능

## 결론

Transformer는 NLP를 넘어 Vision, Audio 등 다양한 분야로 확장되었습니다. BERT, GPT, ViT 등 현대 AI의 근간이 되는 중요한 논문입니다.

> "The Transformer is the first transduction model relying entirely on self-attention."
