'use client';

import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';

// -----------------------------------------------------------
// 1. 노션 데이터 가져오기 (환경변수 보안 적용)
// -----------------------------------------------------------
async function getNotionData() {
  // ✅ 보안 적용: 실제 키를 직접 적지 않고 넷플리파이 설정값(env)을 불러옵니다.
  const NOTION_API_KEY = process.env.NOTION_API_KEY; 
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;

  // 키가 설정되지 않았을 경우 에러 방지
  if (!NOTION_API_KEY || !DATABASE_ID) {
    console.error("환경변수가 설정되지 않았습니다.");
    return [];
  }

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
export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8faff]">
      {/* --- 상단: 3D 메인 화면 --- */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between w-full">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Skyedu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Global Campus
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              조호르바루 현지 인프라를 활용한 <br />
              스카이에듀만의 프리미엄 교육 솔루션.
            </p>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
              2026 캠프 상담하기
            </button>
          </div>

          {/* Spline 3D 구동 */}
          <div className="flex-1 w-full h-[500px] lg:h-[600px]">
            <Spline scene="https://prod.spline.design/6Wq1Q7YInESZ-0pA/scene.splinecode" />
          </div>
        </div>
      </section>
      {/* --- 노션 연동 섹션 (최신 소식) --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">공지사항 및 소식</h2>
          <p className="text-gray-500 mb-12">노션에서 실시간으로 업데이트되는 정보를 확인하세요.</p>
          <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400">
             노션 데이터가 아래에 나타납니다. (배포 후 확인 가능)
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
