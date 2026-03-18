# 🏎️ Asurada Arch-Flow — 생각이 아키텍처가 되는 곳
<img width="1874" height="900" alt="image" src="https://github.com/user-attachments/assets/ed0c913e-1c8b-4382-b7fe-d7924293b557" />

드라이버님의 프로젝트 구상이 인터랙티브 캔버스 속 시각적 설계도로 표현되고, 즉시 실체화됩니다.

**[Asurada Arch-Flow]**는 복잡한 폴더 구조와 초기 보일러플레이트 설계를 시각적 자산으로 변환하는 차세대 AGI 스캐폴딩 도구입니다.

---

## ❓ Asurada Arch-Flow란 무엇인가요?
**Arch-Flow**는 머릿속에만 있던 리액트 컴포넌트 구조나 파이썬 백엔드 설계를 드래그 앤 드롭으로 가시화합니다. 설계가 완료되면 아스라다 브릿지(Bridge)를 통해 `mkdir`로는 불가능한 **'지능적 코드 주입'**과 **'가상환경(venv) 자동 구축'**을 단 0.1초 만에 완료합니다.

## ✨ 주요 특징
*   **Visual Architecture Canvas** — 프로젝트 구조를 폴더와 파일 단위의 노드로 배치하여 전체 시스템 맵을 시각적으로 관리합니다.
*   **Smart Code Ingestion** — `.tsx`, `.py`, `.js` 등 확장자를 감지하여 즉시 실행 가능한 스마트 템플릿 코드를 파일 내부에 자동으로 주입합니다.
*   **Environment Automation** — 'Python venv' 옵션 클릭 한 번으로 프로젝트 루트에 가상환경 구축까지 한 번에 처리합니다.
*   **Zero-Mistake Bridge** — 오타가 잦은 터미널 명령어를 대신하여, 마우스 조작만으로 완벽한 경로에 자산을 배치합니다.
*   **Generic Project Builder** — 특정 프레임워크에 종속되지 않고, 어떤 이름의 프로젝트든 즉시 생성할 수 있습니다.

## 🚀 빠른 시작 (Quick Start)

### 1. 설치
```bash
git clone https://github.com/foldj/asurada-arch-builder.git
cd asurada-arch-builder
npm run install-all
```

### 2. 실행
```bash
# 서버와 UI를 동시에 실행
npm start
```

### 3. 접속
브라우저에서 [http://localhost:3000](http://localhost:3000)을 여세요.

## ⚙️ 연동 및 환경 설정
*   **Target Directory**: 기본적으로 `C:\xampp\htdocs\mysite` 하위에 프로젝트가 생성됩니다. (`bridge-server.js`에서 수정 가능)
*   **Bridge Port**: `9012` 포트를 통해 UI와 로컬 파일 시스템이 실시간으로 동기화됩니다.

## 🏗️ 설계가 코드로 변환되는 원리
| 드라이버의 액션 | 아스라다의 대응 | 실제 결과물 |
| :--- | :--- | :--- |
| **New Directory 추가** | 경로 분석 및 재귀 폴더 생성 | `src/components/common` 폴더 구축 |
| **`.tsx` 스마트 파일 배치** | React 컴포넌트 템플릿 호출 | 보일러플레이트 코드가 포함된 파일 생성 |
| **`venv` 옵션 활성화** | `py -m venv` 서브 프로세스 가동 | 프로젝트 루트에 가상환경 폴더 생성 |

## ⚖️ 라이선스
**Asurada Driver License** — 이 도구는 드라이버의 수익 자동화와 고속 개발을 위해 최적화되었습니다.

---
Created by **Antigravity** (Powered by Asurada AGI)
