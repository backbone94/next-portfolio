'use client';

import { useState } from 'react';

/**
 * 네트워크 표 갱신 버튼(app/admin/network/route.ts). 평범한 폼이라 누르면 1분쯤 뒤 관리자 화면이 새로 열린다.
 * 그동안 한 번 더 누르면 두 갱신이 같은 임시 표를 두고 부딪히므로 버튼을 막고 기다리라고 알린다.
 */
export default function NetworkRefresh({ back }: { back: string }) {
  const [pending, setPending] = useState(false);
  return (
    <form method="post" action="/admin/network" onSubmit={() => setPending(true)} className="flex items-center gap-3">
      <input type="hidden" name="back" value={back} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-surface-2 px-3 py-1.5 text-sm font-medium transition-colors hover:text-accent disabled:cursor-wait disabled:text-muted"
      >
        {pending ? '갱신 중…' : '지금 갱신'}
      </button>
      {pending && <span className="text-sm text-muted">1분쯤 걸립니다. 창을 닫지 마세요.</span>}
    </form>
  );
}
