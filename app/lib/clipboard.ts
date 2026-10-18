/**
 * 복사했다는 알림을 운영체제가 직접 띄우는 환경인지 본다.
 *
 * 안드로이드 13부터는 클립보드에 무언가 복사되면 시스템이 화면 아래에 "복사했어요"를 띄운다.
 * 그 위에 사이트 토스트까지 띄우면 같은 말이 두 번 나온다. 아이폰과 컴퓨터에는 이런 알림이 없다.
 *
 * 크롬은 사용자 에이전트 문자열의 안드로이드 버전을 "10"으로 고정해서 보내므로 그 문자열로는 알 수 없다.
 * userAgentData로 실제 버전을 따로 묻는다. 이 기능이 없는 브라우저(파이어폭스 등)는 모른다고 보고
 * false를 돌려준다. 알림이 두 번 뜨는 편이 아무 알림도 없는 편보다 낫다.
 */
type UADataValues = { platform?: string; platformVersion?: string };
type NavigatorUAData = { platform: string; getHighEntropyValues(hints: string[]): Promise<UADataValues> };

export async function systemShowsCopyNotice(): Promise<boolean> {
  const data = (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData;
  if (!data || data.platform !== 'Android') return false;
  try {
    const { platformVersion } = await data.getHighEntropyValues(['platformVersion']);
    return Number(platformVersion?.split('.')[0]) >= 13;
  } catch {
    return false;
  }
}
