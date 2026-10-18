'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CONTACT } from '../content/site';

/**
 * 누르면 메일 주소를 복사한다. mailto: 링크는 기본 메일 앱이 없는 컴퓨터(웹메일만
 * 쓰는 경우가 많다)에서 아무 반응이 없다.
 *
 * 결과는 버튼 글자를 바꾸지 않고 화면 아래쪽 가운데의 토스트로 잠깐 알린다.
 * 브라우저가 복사를 막으면 주소를 토스트에 보여 줘서 직접 옮겨 적을 수 있게 한다.
 * 토스트는 body에 바로 붙인다. 조상 요소에 transform(떠오르는 연출)이 걸려 있으면
 * fixed가 화면이 아니라 그 요소를 기준으로 잡힌다.
 *
 * 토스트 높이는 어느 화면에서든 같다. 대화 화면의 입력창과 그 위 ↓ 버튼에 가리지
 * 않는 높이를 기준으로 잡고, 상세 페이지도 같은 자리에 띄워 위치가 바뀌지 않게 한다.
 */
export default function CopyEmailButton({ className, children = '메일' }: { className: string; children?: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  // 서버가 그린 화면에는 토스트 자리가 없다. 화면이 뜬 뒤에 붙여야 처음 화면과 어긋나지 않는다.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  async function copy() {
    let text: string;
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      text = `${CONTACT.email} 주소를 복사했습니다.`;
    } catch {
      text = `메일 주소는 ${CONTACT.email}입니다.`;
    }
    // 연달아 눌러도 떠오르는 연출이 다시 돌도록 매번 새 key를 준다
    setToast({ id: Date.now(), text });
  }

  return (
    <>
      <button type="button" onClick={copy} className={className}>
        {children}
      </button>
      {mounted &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-44 z-50 flex justify-center px-5"
          >
            {toast && (
              <p
                key={toast.id}
                className="pointer-events-auto animate-rise select-all rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text shadow-sm"
              >
                {toast.text}
              </p>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
