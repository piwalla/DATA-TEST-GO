/**
 * 색상 대비 확인 스크립트
 * 
 * WCAG AA 준수를 위한 색상 대비 비율 계산
 * - 텍스트: 4.5:1 이상
 * - 큰 텍스트: 3:1 이상
 * - UI 컴포넌트: 3:1 이상
 */

// RGB를 상대 휘도로 변환
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// 대비 비율 계산
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(...color1);
  const lum2 = getLuminance(...color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Hex를 RGB로 변환
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

// 색상 대비 확인
function checkContrast(foreground, background, type = 'text') {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) {
    console.error('Invalid color format. Use hex format (e.g., #2B7DE9)');
    return null;
  }

  const ratio = getContrastRatio(fgRgb, bgRgb);
  const requirements = {
    text: 4.5,
    largeText: 3.0,
    ui: 3.0,
  };

  const required = requirements[type] || requirements.text;
  const passed = ratio >= required;

  return {
    ratio: ratio.toFixed(2),
    required: required.toFixed(1),
    passed,
    status: passed ? '✅ 통과' : '❌ 실패',
  };
}

// My Trip 주요 색상 조합 확인
console.log('=== My Trip 색상 대비 확인 ===\n');

// 1. Primary Blue (#1E6BC8)와 흰색 배경 (개선 후)
console.log('1. Primary Blue (#1E6BC8) on White Background (개선 후)');
const blueOnWhite = checkContrast('#1E6BC8', '#FFFFFF', 'ui');
console.log(`   대비 비율: ${blueOnWhite.ratio}:1 (필요: ${blueOnWhite.required}:1)`);
console.log(`   상태: ${blueOnWhite.status}\n`);

// 2. Primary Blue (#1E6BC8)와 흰색 텍스트 (버튼용, 개선 후)
console.log('2. White Text on Primary Blue (#1E6BC8) (개선 후)');
const whiteOnBlue = checkContrast('#FFFFFF', '#1E6BC8', 'text');
console.log(`   대비 비율: ${whiteOnBlue.ratio}:1 (필요: ${whiteOnBlue.required}:1)`);
console.log(`   상태: ${whiteOnBlue.status}\n`);

// 3. 텍스트 색상 (검은색)과 흰색 배경
console.log('3. Text Color (Black) on White Background');
const blackOnWhite = checkContrast('#000000', '#FFFFFF', 'text');
console.log(`   대비 비율: ${blackOnWhite.ratio}:1 (필요: ${blackOnWhite.required}:1)`);
console.log(`   상태: ${blackOnWhite.status}\n`);

// 4. Muted Foreground와 흰색 배경
console.log('4. Muted Foreground on White Background');
// oklch(0.556 0 0)를 대략적인 hex로 변환 (회색)
const mutedOnWhite = checkContrast('#6C757D', '#FFFFFF', 'text');
console.log(`   대비 비율: ${mutedOnWhite.ratio}:1 (필요: ${mutedOnWhite.required}:1)`);
console.log(`   상태: ${mutedOnWhite.status}\n`);

// 5. Primary Teal (#008B7A)와 흰색 배경 (개선 후)
console.log('5. Primary Teal (#008B7A) on White Background (개선 후)');
const tealOnWhite = checkContrast('#008B7A', '#FFFFFF', 'ui');
console.log(`   대비 비율: ${tealOnWhite.ratio}:1 (필요: ${tealOnWhite.required}:1)`);
console.log(`   상태: ${tealOnWhite.status}\n`);

// 6. Accent Orange (#E55A2B)와 흰색 배경 (개선 후)
console.log('6. Accent Orange (#E55A2B) on White Background (개선 후)');
const orangeOnWhite = checkContrast('#E55A2B', '#FFFFFF', 'ui');
console.log(`   대비 비율: ${orangeOnWhite.ratio}:1 (필요: ${orangeOnWhite.required}:1)`);
console.log(`   상태: ${orangeOnWhite.status}\n`);

console.log('=== 확인 완료 ===');
console.log('\n참고: 실제 색상은 oklch 색공간을 사용하므로 정확한 대비는 Lighthouse로 확인하세요.');

