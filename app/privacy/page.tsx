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
        <p className="text-sm text-base-content/50">시행일자 2026-11-19</p>
        <p className="text-sm text-base-content/60 mt-4 leading-relaxed">
          이 페이지는 사이트 우측 하단 AI 챗봇 위젯이 수집하는 개인정보에 대한 처리방침입니다.
          사이트 운영자(이하 &ldquo;운영자&rdquo;)는 허창훈 개인이며, 본 챗봇은 포트폴리오 사이트 방문자 응대 목적의
          비상업적 서비스입니다.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-2">1. 수집하는 개인정보의 항목</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          챗봇 이용 과정에서 대화 내용(질문·응답), 대화·요청 식별자, 접속 시각, 접속 IP가 수집됩니다.
          답변 평가를 선택하면 평가와 해당 질문·답변의 연결 정보도 저장됩니다. IP는 과도한 요청을 막기 위해 사용하며
          대화 기록의 IP는 아래 보유 기간을 따릅니다. 별도 호출 제한 기록은 하루가 지난 뒤 매일 정리 작업에서 삭제합니다.
          이용자가 이름, 이메일, 연락처 등을 입력하면 대화 내용의 일부로 저장될 수 있습니다.
          첨부 이미지는 AI 응답 생성을 위해 전송하지만 운영 데이터베이스나 브라우저 저장소에는 저장하지 않습니다.
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
          대화와 연결된 요청·답변 평가 기록은 최종 활동일로부터 <strong>1년간 보관 후 자동 파기</strong>됩니다. 대화 종료는 기록 삭제와 다릅니다. 1년 이내라도 이용자가 삭제를
          요청하면 즉시 파기합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">4. 제3자 제공 및 국외 이전</h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          운영자는 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 챗봇 응답 생성을 위해 질문·최근 대화 내용과 선택한 첨부 이미지가{' '}
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
          현재 탭의 <code>sessionStorage</code>에 대화 식별자와 최근 60개 대화 텍스트, 답변 참고 링크·평가 선택을 보관합니다.
          종료한 대화는 최근 10개까지 확인할 수 있으며 마지막 저장 후 24시간이 지난 기록은 복원하지 않습니다.
          이미지 데이터는 저장하지 않습니다. 탭을 닫거나 저장소를 지우면 탭의 기록은 사라지지만 서버 대화 기록이 삭제되지는 않습니다.
          최초 안내 표시 여부만 <code>localStorage</code>에 보관합니다. 이 저장소는 서버로 전송되는 쿠키가 아닙니다.
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
