import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리방침 | HUNI²',
  description: '우측 하단 AI 챗봇이 수집하는 개인정보에 대한 처리방침.',
};

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl mx-auto space-y-10 text-base-content">
      <header>
        <h1 className="text-2xl font-bold mb-1">개인정보 처리방침</h1>
        <p className="text-sm text-base-content/50">시행일자 2026-11-16</p>
        <p className="text-sm text-base-content/60 mt-4 leading-relaxed">
          이 페이지는 사이트 우측 하단 AI 챗봇 위젯이 수집하는 개인정보에 대한 처리방침입니다.
          사이트 운영자(이하 &ldquo;운영자&rdquo;)는 허창훈 개인이며, 본 챗봇은 포트폴리오 사이트 방문자 응대 목적의
          비상업적 서비스입니다.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-2">1. 수집하는 개인정보의 항목</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          챗봇 이용 과정에서 대화 내용(질문·응답), 세션 식별자(브라우저 <code>localStorage</code>에 저장되는 임의의
          식별값), 접속 시각이 자동으로 수집됩니다. 이용자가 대화 중 자발적으로 이름, 이메일, 연락처 등을 입력하면
          해당 내용도 대화 내용의 일부로 저장될 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">2. 수집 및 이용 목적</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          챗봇이 이전 대화 맥락을 참고해 더 적절한 답변을 생성하기 위함, 서비스 오류·악용 여부를 파악하기 위함,
          운영자의 자체 응답 품질 점검을 위함입니다. 수집된 정보는 위 목적 외의 용도로 사용되지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">3. 보유 및 이용 기간</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          대화 이력은 최종 활동일로부터 <strong>1년간 보관 후 자동 파기</strong>됩니다. 1년 이내라도 이용자가 삭제를
          요청하면 즉시 파기합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">4. 제3자 제공 및 국외 이전</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          운영자는 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 챗봇 응답 생성을 위해 대화 내용이{' '}
          <strong>Google LLC(Gemini API)</strong>의 서버(미국 등 Google 데이터센터 소재국)로 전송·처리됩니다.
          운영자는 주민등록번호, 계좌번호 등 민감정보를 별도로 수집하지 않으며, 이용자도 대화 중 이러한 정보를
          입력하지 않기를 권장합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">5. 정보주체의 권리</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          이용자는 언제든지 자신의 대화 이력 열람·삭제를 요청할 수 있습니다. 아래 문의처로 연락해주세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">6. 쿠키 등 자동 수집 장치</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          세션 식별자 저장을 위해 브라우저 <code>localStorage</code>를 사용합니다(서버로 전송되는 쿠키가 아님).
          브라우저 설정에서 언제든 삭제할 수 있으며, 삭제 시 새로운 세션으로 시작됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">7. 개인정보 보호책임자 / 문의처</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          허창훈 · <a href="mailto:powerhch@gmail.com" className="underline">powerhch@gmail.com</a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">8. 개인정보처리방침의 변경</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          본 방침은 법령, 서비스 변경에 따라 수정될 수 있으며, 변경 시 이 페이지를 통해 공지합니다.
        </p>
      </section>
    </article>
  );
}
