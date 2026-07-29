/* ==========================================================================
   소리글 (Soriguel) 인터랙션 & 데이터 유효성 검사 스크립트
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. 헤더 스크롤 효과 (Header Scroll Class)
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 2. 모바일 메뉴 토글 (Mobile Menu Navigation)
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  
  mobileToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
    
    // 햄버거 버튼 디자인 변경 애니메이션
    const bars = mobileToggle.querySelectorAll(".bar");
    if (isOpen) {
      bars[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      bars[1].style.opacity = "0";
      bars[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
    } else {
      bars[0].style.transform = "none";
      bars[1].style.opacity = "1";
      bars[2].style.transform = "none";
    }
  });

  // 모바일 링크 클릭 시 메뉴 닫기
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      const bars = mobileToggle.querySelectorAll(".bar");
      bars[0].style.transform = "none";
      bars[1].style.opacity = "1";
      bars[2].style.transform = "none";
    });
  });

  // 3. 히스토리 더 보기 토글 (Timeline History Toggle)
  const historyToggleBtn = document.getElementById("history-toggle-btn");
  const hiddenHistoryPanel = document.getElementById("hidden-history-panel");
  
  historyToggleBtn.addEventListener("click", () => {
    const isPanelOpen = hiddenHistoryPanel.classList.contains("open");
    if (isPanelOpen) {
      hiddenHistoryPanel.classList.remove("open");
      historyToggleBtn.innerHTML = "소리글 역대 출간작 및 음원 성과 자세히 보기 &darr;";
    } else {
      hiddenHistoryPanel.classList.add("open");
      historyToggleBtn.innerHTML = "출간작 및 음원 성과 목록 접기 &uarr;";
      // 토글 열릴 때 스크롤 위치 맞추기
      setTimeout(() => {
        hiddenHistoryPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  });

  // 4. 커리큘럼 탭 전환 (Curriculum Tab Switcher)
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      // 활성화 버튼 초기화 및 등록
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // 탭 콘텐츠 표시 제어
      tabContents.forEach(content => {
        if (content.getAttribute("id") === targetTab) {
          content.classList.add("active");
        } else {
          content.classList.remove("active");
        }
      });
    });
  });

  // 5. 신청 전 주의사항 토글 (Caution Accordion)
  const cautionToggleBtn = document.getElementById("caution-toggle-btn");
  const cautionContent = document.getElementById("caution-content");
  
  cautionToggleBtn.addEventListener("click", () => {
    const isOpen = cautionContent.classList.contains("open");
    if (isOpen) {
      cautionContent.classList.remove("open");
      cautionToggleBtn.innerHTML = "⚠️ 신청 전 필수 확인사항 (주의사항 및 규정) &darr;";
    } else {
      cautionContent.classList.add("open");
      cautionToggleBtn.innerHTML = "필수 확인사항 내용 접기 &uarr;";
      setTimeout(() => {
        cautionContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 200);
    }
  });

  // 6. FAQ 아코디언 (FAQ Accordion with smooth height)
  const faqItems = document.querySelectorAll(".faq-item");
  
  faqItems.forEach(item => {
    const trigger = item.querySelector(".faq-trigger");
    const answer = item.querySelector(".faq-answer");
    
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      
      // 다른 모든 아코디언은 닫아줌 (단일 오픈 모드)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-trigger").setAttribute("aria-expanded", "false");
          otherItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });
      
      if (isExpanded) {
        trigger.setAttribute("aria-expanded", "false");
        item.classList.remove("active");
        answer.style.maxHeight = null;
      } else {
        trigger.setAttribute("aria-expanded", "true");
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // 7. 신청서 폼 유효성 검증 및 축하 팝업 모달 작동
  const form = document.getElementById("sorigeul-apply-form");
  const modal = document.getElementById("apply-success-modal");
  const modalClose = modal.querySelector(".modal-close");
  const modalConfirmBtn = document.getElementById("modal-confirm-btn");
  
  // 개별 에러 표기 함수
  const setError = (elementId, showError) => {
    const inputElement = document.getElementById(elementId);
    const formGroup = inputElement.closest(".form-group");
    if (showError) {
      formGroup.classList.add("error");
    } else {
      formGroup.classList.remove("error");
    }
  };
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById("user-name");
    const phoneInput = document.getElementById("user-phone");
    const emailInput = document.getElementById("user-email");
    const privacyCheckbox = document.getElementById("agree-privacy");
    
    let isValid = true;
    
    // 이름 검증
    if (nameInput.value.trim() === "") {
      setError("user-name", true);
      isValid = false;
    } else {
      setError("user-name", false);
    }
    
    // 연락처 검증 (정규식: 01X-XXXX-XXXX 형태 또는 숫자 연속)
    const phoneRegex = /^(01[016789])[-. ]?(\d{3,4})[-. ]?(\d{4})$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
      setError("user-phone", true);
      isValid = false;
    } else {
      setError("user-phone", false);
    }
    
    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      setError("user-email", true);
      isValid = false;
    } else {
      setError("user-email", false);
    }
    
    // 개인정보동의 검증
    if (!privacyCheckbox.checked) {
      setError("agree-privacy", true);
      isValid = false;
    } else {
      setError("agree-privacy", false);
    }
    
    // 유효성 통과 시 모달 오픈
    if (isValid) {
      modal.style.display = "flex";
      form.reset(); // 전송 후 양식 비우기
    }
  });
  
  // 모달 닫기 제어
  const closeModal = () => {
    modal.style.display = "none";
  };
  
  modalClose.addEventListener("click", closeModal);
  modalConfirmBtn.addEventListener("click", closeModal);
  
  // 모달 바깥쪽 클릭 시 닫기
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // ESC 누르면 모달 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeModal();
    }
  });

  // 8. 스크롤 트리거 애니메이션 (Intersection Observer)
  const scrollAnims = document.querySelectorAll(".scroll-anim");
  
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear");
          observer.unobserve(entry.target); // 한 번 등장하면 관찰 종료
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });
    
    scrollAnims.forEach(el => observer.observe(el));
  } else {
    // 구형 브라우저 대응: 즉시 노출
    scrollAnims.forEach(el => el.classList.add("appear"));
  }
  
});
