import React from 'react';

// -----------------------------------------------------------
// 1. 노션 데이터 가져오기 (StackBlitz 에러 방지용으로 수정됨)
// -----------------------------------------------------------
async function getNotionData() {
  const NOTION_API_KEY = "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"; 
  const DATABASE_ID = "6e46a48a-2c09-4440-abc4-6bc7d0aec972";

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      // 넷플리파이에서 가장 확실하게 실시간 데이터를 갱신하는 설정입니다.
      next: { revalidate: 0 } 
    });

    if (!res.ok) {
      console.error(`노션 에러 상태 코드: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.results;
    
  } catch (error) {
    // 통신 자체가 실패하더라도 웹사이트 전체가 뻗지 않도록 막아줍니다.
    console.error("통신 실패 에러(StackBlitz 이슈):", error);
    return [];
  }
}
// -----------------------------------------------------------
// 2. 전체 페이지 조립
// -----------------------------------------------------------
export default async function Home() {
  const posts = await getNotionData();

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* --- 메인 화면 (Hero Section) --- */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6">
              🚀 2026 말레이시아 어학원, 국제학교 단기 스쿨링 모집 중
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              글로벌 교육의 <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                새로운 기준, Skyedu
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              조호르바루 조기유학부터 프리미엄 영어 캠프까지. 
              단순한 입시를 넘어, 우리 아이의 완벽한 미래를 위한 최적의 교육 솔루션을 경험하세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#consult" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                무료 상담 신청
              </a>
            </div>
          </div>
          <div className="flex-1 w-full flex justify-center lg:justify-end h-[400px] lg:h-[600px] relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
            <iframe src="https://my.spline.design/interactivespheres-placeholder/" frameBorder="0" className="w-full h-full object-cover"></iframe>
          </div>
        </div>
      </section>

      {/* --- 노션 연동 섹션 (최신 소식) --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">최신 소식 및 캠프 일정</h2>
            <p className="mt-2 text-lg text-gray-500">스카이에듀의 실시간 업데이트를 확인하세요.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <p className="text-gray-500 col-span-3">노션에서 불러올 데이터가 없습니다. 노션 표에 글을 작성해 주세요.</p>
            ) : (
              posts.map((post: any) => {
                // 노션 표에서 방금 만든 '제목', '분류', '요약' 속성값을 정확히 가져옵니다.
                const title = post.properties['제목']?.title[0]?.plain_text || '제목 없음';
                const category = post.properties['분류']?.select?.name || '공지사항';
                const summary = post.properties['요약']?.rich_text[0]?.plain_text || '내용을 확인해주세요.';
                const date = new Date(post.created_time).toLocaleDateString('ko-KR');

                return (
                  <div key={post.id} className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    <div className="mb-4 flex justify-between items-center">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                        {category}
                      </span>
                      <span className="text-sm text-gray-400">{date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {summary}
                    </p>
                    <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm">
                      자세히 보기 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
