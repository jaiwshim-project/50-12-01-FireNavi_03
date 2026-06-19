// AWS Bedrock API 접속 테스트 — Claude Sonnet 4.6
// 메가존클라우드 제공 정보 기반
// 실행: node test-bedrock.js

const BEARER_TOKEN = process.env.BEDROCK_BEARER_TOKEN;
const REGION = 'us-east-1';
const MODEL_ID = 'us.anthropic.claude-sonnet-4-6';
const URL = `https://bedrock-runtime.${REGION}.amazonaws.com/model/${MODEL_ID}/converse`;

async function test() {
  if (!BEARER_TOKEN) {
    console.error('BEDROCK_BEARER_TOKEN 환경변수를 설정한 뒤 실행하세요.');
    process.exit(1);
  }

  console.log('=== AWS Bedrock 접속 테스트 ===');
  console.log(`Region : ${REGION}`);
  console.log(`Model  : ${MODEL_ID}`);
  console.log(`URL    : ${URL}\n`);

  const body = {
    messages: [{
      role: 'user',
      content: [{ text: '안녕하세요. API 연결 테스트입니다. 한 문장으로 답해주세요.' }]
    }],
    inferenceConfig: {
      maxTokens: 100,
      temperature: 0.5,
    }
  };

  try {
    console.log('요청 중...');
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    const text = await res.text();

    if (res.ok) {
      const data = JSON.parse(text);
      const reply = data?.output?.message?.content?.[0]?.text || '(파싱 실패)';
      console.log(`\n✅ 접속 성공! (HTTP ${res.status})`);
      console.log(`AI 응답: ${reply}`);
      console.log('\n사용 가능한 설정:');
      console.log(`  REGION     = "${REGION}"`);
      console.log(`  MODEL_ID   = "${MODEL_ID}"`);
    } else {
      console.log(`\n❌ 실패 (HTTP ${res.status})`);
      console.log(`응답: ${text.slice(0, 300)}`);
    }
  } catch (e) {
    console.log(`\n❌ 오류: ${e.message}`);
  }
}

test();
