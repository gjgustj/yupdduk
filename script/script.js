/**
 * 동대문 엽기떡볶이 Official Interactive Script (Vanilla JS)
 * - Smooth Scroll: Lenis.js
 * - Animations: GSAP 3 & ScrollTrigger
 * - Carousel: Swiper.js
 * - Icons: Lucide Icons
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. LUCIDE ICONS INITIALIZATION
       ======================================================== */
    {
        lucide.createIcons();
    }

    /* ========================================================
       2. SMOOTH SCROLL (LENIS) + GSAP SCROLLTRIGGER SYNC
       ======================================================== */
    let lenis = null;
         {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Sync Lenis with GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }

    /* ========================================================
       3. SWIPER CAROUSELS
       ======================================================== */
    // 3.1 Hero Banner Slider
    let heroSwiper = null;
    if (document.querySelector('.heroSwiper')) {
        heroSwiper = new Swiper('.heroSwiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.heroSwiper .swiper-pagination',
                clickable: true,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }

    // 3.2 Menu Slider
    let menuSwiper = null;
    if (document.querySelector('.menuSwiper')) {
        menuSwiper = new Swiper('.menuSwiper', {
            slidesPerView: 1.2,
            spaceBetween: 20,
            loop: true,
            speed: 600,
            navigation: {
                nextEl: '.menu-next-btn',
                prevEl: '.menu-prev-btn',
            },
            breakpoints: {
                480: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 28,
                }
            }
        });
    }

    // 3.3 Event & News Slider
    let eventSwiper = null;
    if (document.querySelector('.eventSwiper')) {
        eventSwiper = new Swiper('.eventSwiper', {
            slidesPerView: 1.1,
            spaceBetween: 20,
            loop: false,
            speed: 600,
            navigation: {
                nextEl: '.event-next-btn',
                prevEl: '.event-prev-btn',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
    }

    /* ========================================================
       4. NAVIGATION & MOBILE DRAWER
       ======================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openMobileDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('translate-x-full');
        drawerOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('translate-x-full');
        drawerOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileDrawer);
    }
    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', closeMobileDrawer);
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeMobileDrawer);
    }
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });

    // Sticky Header Shadow on Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('shadow-md');
        } else {
            header.classList.remove('shadow-md');
        }
    });

    // 4.2 GNB Links Hover & Active Click State (검정색 -> 호버/클릭 시 빨간색)
    const gnbLinks = document.querySelectorAll('.gnb-link');
    const pageSections = [
        { id: '#story', el: document.getElementById('story') },
        { id: '#menu', el: document.getElementById('menu') },
        { id: '#event', el: document.getElementById('event') },
        { id: '#customer', el: document.getElementById('customer') }
    ];

    function setActiveGnbLink(targetHref) {
        gnbLinks.forEach(link => {
            if (targetHref && link.getAttribute('href') === targetHref) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    gnbLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            setActiveGnbLink(href);
        });
    });

    // ScrollSpy: Update active menu based on scroll position
    function updateGnbScrollSpy() {
        const scrollPos = window.scrollY + 150;

        // At top hero banner, keep all menus in default black state
        if (window.scrollY < 300) {
            setActiveGnbLink(null);
            return;
        }

        let currentId = null;
        for (let i = pageSections.length - 1; i >= 0; i--) {
            const sec = pageSections[i];
            if (sec.el && scrollPos >= sec.el.offsetTop) {
                currentId = sec.id;
                break;
            }
        }
        setActiveGnbLink(currentId);
    }

    window.addEventListener('scroll', updateGnbScrollSpy, { passive: true });

    /* ========================================================
       5. MENU TAB FILTERING
       ======================================================== */
    const menuTabButtons = document.querySelectorAll('.menu-tab-btn');
    const menuItems = [
        {
            category: 'main',
            title: '엽기떡볶이',
            price: '14,000원',
            img: './images/menu01.png',
            tag: '더착한맛 ~ 매운맛'
        },
        {
            category: 'main',
            title: '로제떡볶이',
            price: '16,000원',
            img: './images/menu02.png',
            tag: '착한맛, 오리지널'
        },
        {
            category: 'main',
            title: '마라떡볶이',
            price: '16,000원',
            img: './images/menu03.png',
            tag: '착한맛, 오리지널'
        },
        {
            category: 'main',
            title: '마라로제떡볶이',
            price: '18,000원',
            img: './images/menu04.png',
            tag: '착한맛, 오리지널'
        },
        {
            category: 'main',
            title: '엽기닭볶음탕',
            price: '24,000원',
            img: './images/menu05.png',
            tag: '더착한맛 ~ 매운맛'
        },
        // Side category
        {
            category: 'side',
            title: '모둠튀김',
            price: '2,500원',
            img: './images/sidemenu01.png',
        },
        {
            category: 'side',
            title: '바삭치즈만두 (7개)',
            price: '2,000원',
            img: './images/sidemenu02.png',
        },
        {
            category: 'side',
            title: '주먹김밥 (셀프)',
            price: '2,000원',
            img: './images/sidemenu03.png',
        },
        {
            category: 'side',
            title: '엽기 꿔바로우 (5개)',
            price: '5,900원',
            img: './images/sidemenu04.png',
        },
        // Set category
        {
            category: 'set',
            title: '실속세트',
            price: '17,500원',
            desc: '떡볶이 + 주먹김밥 + 모둠튀김',
            img: './images/setmenu01.png',
            tag: '2~3인 추천 가성비 세트'
        },
        {
            category: 'set',
            title: '베스트세트',
            price: '20,000원',
            desc: '떡볶이 + 주먹김밥 + 모둠튀김 + 중국당면',
            img: './images/setmenu02.png',
            tag: '엽떡 매니아 원픽'
        },
        {
            category: 'set',
            title: '스페셜세트',
            price: '25,000원',
            desc: '떡볶이 + 모둠튀김 + 주먹김밥 + 중국당면 + 엽봉(5개)',
            img: './images/setmenu03.png',
            tag: '3~4인 파티 추천'
        }
    ];

    function renderMenuItems(category) {
        const wrapper = document.getElementById('menuSwiperWrapper');
        if (!wrapper) return;

        const filtered = menuItems.filter(item => item.category === category);
        const prevBtn = document.querySelector('.menu-prev-btn');
        const nextBtn = document.querySelector('.menu-next-btn');

        if (prevBtn && nextBtn) {
            const showButtons = category === 'main';
            prevBtn.style.display = showButtons ? '' : 'none';
            nextBtn.style.display = showButtons ? '' : 'none';
        }
        
        wrapper.innerHTML = filtered.map(item => `
            <div class="swiper-slide menu-card group" data-category="${item.category}">
                <div class="bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center">
                    <div class="w-40 h-40 sm:w-48 sm:h-48 mb-5 relative flex items-center justify-center">
                        <img src="${item.img}" alt="${item.title}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md">
                        ${item.badge ? `
    <span class="absolute top-2 right-2 px-2.5 py-0.5 ${item.badgeBg || ''} text-white text-[11px] font-black rounded-full">${item.badge}</span>
` : ''}
                        </div>
<h3 class="text-lg font-bold text-gray-900 mt-2">${item.title}</h3>
<p class="text-xs text-gray-400 mt-1">${item.price}</p>

                    ${item.tag ? `
    <div class="mt-4 flex items-center gap-1">
        <span class="w-2.5 h-2.5 rounded-full ${item.badgeBg || 'bg-red-500'}"></span>
        <span class="text-[11px] font-semibold text-gray-400">${item.tag}</span>
    </div>
` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        if (menuSwiper) {
            menuSwiper.update();
            menuSwiper.slideToLoop(0, 400);
        }
    }

    menuTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            menuTabButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-yupYellow', 'text-gray-900', 'border-yupYellow');
                btn.classList.add('bg-white', 'text-gray-500', 'border-gray-300');
            });
            button.classList.add('active', 'bg-yupYellow', 'text-gray-900', 'border-yupYellow');
            button.classList.remove('bg-white', 'text-gray-500', 'border-gray-300');

            const category = button.getAttribute('data-category');
            renderMenuItems(category);
        });
    });

    // Submenu click integration for Menu tab
    document.querySelectorAll('.menu-sub-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetCategory = link.getAttribute('data-menu-tab');
            const targetBtn = document.querySelector(`.menu-tab-btn[data-category="${targetCategory}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
        });
    });

    /* ========================================================
       6. EVENT SECTION & DETAIL POPUP MODAL INTERACTION
       ======================================================== */
    // 6.1 Event Detailed Data
    const eventDetailsData = {
        challenge: {
            badge: '친환경 챌린지',
            badgeClass: 'bg-emerald-100 text-emerald-800',
            date: '2026.01.01 ~ 2026.12.31',
            title: '2026년 함께해요 용기챌린지!',
            img: './images/event01.png',
            content: `
                <div class="space-y-4">
                    <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
                        <h4 class="font-bold text-emerald-900 text-base mb-1">🌿2026년 함께해요 용기내챌린지!</h4>
                        <p class="text-sm text-emerald-800 leading-relaxed">
                            지구를 생각하는 작은 용기!<br>
                            챌린지 참여하고, 엽떡앱 쿠폰과 다회용기 받아가세요!
                        </p>
                    </div>

                    <div class="space-y-2">
                        <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> 참여 방법
                        </h5>
                        <ol class="list-decimal list-inside text-sm space-y-1.5 pl-1 text-gray-600">
                            <li>주문 전, 매장에 확인 전화하기</li>
                            <li>방문포장 주문하기</li>
                            <li>참여 후기 및 인증샷 인스타그램 업로드</li>
                            <li>네이버폼 양식 제출하기</li>
                        </ol>
                    </div>

                    <div class="space-y-2">
                        <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> 경품
                        </h5>
                        <ul class="text-sm space-y-1.5 pl-1 text-gray-600">
                            <li>🎁엽떡앱 14,000원 할인쿠폰 + 엽기떡볶이 전용 다회용기 <strong>[당첨자 인원- 100명]</strong></li>
                        </ul>
                    </div>
                </div>
            `
        },
        mild: {
            badge: 'NEW MENU',
            badgeClass: 'bg-amber-100 text-amber-800',
            date: '2026.09.16(수) 출시',
            title: '신메뉴 더 착한맛 출시안내',
            img: './images/event02.png',
            content: `
                <div class="space-y-4">
                    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
                        <h4 class="font-bold text-amber-900 text-base mb-1">💛신메뉴 더착한맛 출시 안내</h4>
                        <p class="text-sm text-amber-800 leading-relaxed">
                            맵찔이도 부담없이 즐길 수 있는 "더착한맛"출시!<br>
                            엽기떡볶이의 맛은 그대로, 맵기는 한층 더 부드럽게 즐겨보세요.
                        </p>
                    </div>

                    <div class="space-y-2">
                        <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span> 메뉴 소개
                        </h5>
                        <ul class="text-sm space-y-1.5 pl-1 text-gray-600">
                            <li>✨ 신규 추가 맛 : 더착한맛</li>
                            <li>✨ 적응메뉴 : 4인 엽기메뉴(떡볶이/반반/오뎅/분모지), 엽기닭볶음탕</li>
                            <li>단, 2인 엽기떡볶이는 '더착한맛' 적용 불가</li>
                        </ul>
                    </div>

                    <div class="space-y-2">
                        <h5 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span> 주문 및 혜택 안내
                        </h5>
                        <ul class="text-sm space-y-1.5 pl-1 text-gray-600">
                            <li>엽기떡볶이 / 엽기오뎅 / 엽기반반 메뉴 주문 시 맵기 선택에서 <strong>[더 착한맛]</strong>을 선택하세요.</li>
                            <li>엽떡 공식 앱 출시 기념 <strong>'더 착한맛' 주문 시 바삭치즈만두(7개) 무료 증정 쿠폰</strong> 제공!</li>
                        </ul>
                    </div>
                </div>
            `
        },
        awards: {
            badge: 'AWARDS',
            badgeClass: 'bg-red-100 text-yupRed',
            date: '2026.09.01 ~ 2027.08.31',
            title: '2026 올해의 브랜드 대상 10년 연속 1위 마스터피스 수상',
            img: './images/event03.png',
            content: `
                <div class="space-y-4">
                    <div class="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5">
                        <h4 class="font-bold text-yupRed text-base mb-1">🏆2026 올해의 브랜드 대상 10년 연속 수상</h4>
                        <p class="text-sm text-red-950 leading-relaxed">
                            올해의 브랜드 대상은 한국소비자포럼에서 주관하며,<br>
                            대국민 투표와 위원회의 심의를 거쳐 한해를 빛낸 최고의 브랜드를 선정하는 시상식 입니다.<br>
                            10년 동안 변함없는 사랑을 보내주신 고객 여러분께 진심으로 감사 드립니다.<br>
                            앞으로도 대한민국 대표 떡볶이 브랜드로서 맛과 경쟁력을 유지하며 고객 만족에 최선을 다하겠습니다.<br>
                            다시 한번, 동대문엽기떡볶이에 보내주신 고객님의 성원에 감사의 인사 드립니다.<br>
                            감사합니다.
                        </p>
                    </div>
                </div>
            `
        }
    };

    // 6.2 Event Modal Popup Controls
    const eventModal = document.getElementById('eventModal');
    const modalBackdrop = document.getElementById('eventModalBackdrop');
    const closeEventModalBtn = document.getElementById('closeEventModalBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalBadge = document.getElementById('modalBadge');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalImg = document.getElementById('modalImg');
    const modalBody = document.getElementById('modalBody');

    let activeEventBtn = null;

    function openEventModal(eventId, triggerBtn) {
        const data = eventDetailsData[eventId];
        if (!data || !eventModal) return;

        // Reset previous active button state if any
        if (activeEventBtn) {
            activeEventBtn.classList.remove('active');
        }
        if (triggerBtn) {
            triggerBtn.classList.add('active');
            activeEventBtn = triggerBtn;
        }

        modalBadge.textContent = data.badge;
        modalBadge.className = `inline-block px-3 py-1 font-black text-xs rounded-full ${data.badgeClass}`;
        modalTitle.textContent = data.title;
        modalDate.textContent = data.date;
        modalImg.src = data.img;
        modalImg.alt = data.title;
        modalBody.innerHTML = data.content;

        eventModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function closeEventModal() {
        if (!eventModal) return;
        eventModal.classList.remove('open');
        document.body.style.overflow = '';
        if (activeEventBtn) {
            activeEventBtn.classList.remove('active');
            activeEventBtn = null;
        }
    }

    // Attach click event to all VIEW MORE buttons
    document.querySelectorAll('.event-view-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const eventId = btn.getAttribute('data-event-id');
            openEventModal(eventId, btn);
        });
    });

    if (closeEventModalBtn) closeEventModalBtn.addEventListener('click', closeEventModal);
    if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', closeEventModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeEventModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && eventModal && eventModal.classList.contains('open')) {
            closeEventModal();
        }
    });

    // 6.3 Event Tabs Filtering (이벤트 / 신메뉴소식 / 미디어)
    const eventTabButtons = document.querySelectorAll('.event-tab-btn');
    const eventCards = document.querySelectorAll('.event-card');

    eventTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            eventTabButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-[#F8C014]', 'text-black', 'font-black', 'border-[#F8C014]');
                btn.classList.add('bg-white', 'text-gray-400', 'border-gray-300', 'font-medium');
            });
            button.classList.add('active', 'bg-[#F8C014]', 'text-black', 'font-black', 'border-[#F8C014]');
            button.classList.remove('bg-white', 'text-gray-400', 'border-gray-300', 'font-medium');

            const filter = button.getAttribute('data-event');
            eventCards.forEach(card => {
                const cardCats = (card.getAttribute('data-event') || '').split(' ');
                if (filter === 'event' || filter === 'all' || cardCats.includes(filter)) {
    card.style.display = '';
} else {
    card.style.display = 'none';
}
            });

            if (eventSwiper) {
    eventSwiper.update();
    eventSwiper.slideTo(0, 0);
}
        });
    });

    // Submenu links integration for Event tab
    document.querySelectorAll('.event-sub-link').forEach(link => {
        link.addEventListener('click', () => {
            const targetCat = link.getAttribute('data-event-tab');
            const targetBtn = document.querySelector(`.event-tab-btn[data-event="${targetCat}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
        });
    });

    /* ========================================================
       7. STORE & CUSTOMER SECTION INTERACTION (EXACT SPEC)
       ======================================================== */
    // 7.1 Main Tabs (매장찾기 / 자주묻는 질문 / 고객의소리)
    const mainCustomerTabs = document.querySelectorAll('.main-customer-tab');
    const customerPanels = document.querySelectorAll('.customer-tab-panel');

    mainCustomerTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanelId = tab.getAttribute('data-target-tab');

            // Reset tab styles
            mainCustomerTabs.forEach(t => {
                t.classList.remove('active', 'bg-[#F8C014]', 'text-black', 'font-black', 'border-[#F8C014]');
                t.classList.add('bg-white', 'text-gray-400', 'border-gray-300', 'font-semibold');
            });

            // Activate clicked tab
            tab.classList.add('active', 'bg-[#F8C014]', 'text-black', 'font-black', 'border-[#F8C014]');
            tab.classList.remove('bg-white', 'text-gray-400', 'border-gray-300', 'font-semibold');

            // Show corresponding panel
            customerPanels.forEach(panel => {
                if (panel.id === targetPanelId) {
                    panel.classList.remove('hidden');
                    panel.classList.add('block');
                    {
                        gsap.from(panel, { opacity: 0, y: 15, duration: 0.35, ease: 'power2.out' });
                    }
                } else {
                    panel.classList.add('hidden');
                    panel.classList.remove('block');
                }
            });
        });
    });

    // Submenu click integration for Customer tab
    document.querySelectorAll('.customer-sub-link').forEach(link => {
        link.addEventListener('click', () => {
            const targetPanelId = link.getAttribute('data-nav-customer');
            const targetBtn = document.querySelector(`.main-customer-tab[data-target-tab="${targetPanelId}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
        });
    });

    // 7.2 FAQ Sub-Category Filter Tabs (전체보기, 제품, 주문, 결제, 기타문의)
    const faqSubTabs = document.querySelectorAll('.faq-sub-tab');
    const faqRows = document.querySelectorAll('.faq-row');

    faqSubTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-faq-cat');

            // Toggle active styling
            faqSubTabs.forEach(t => {
                t.classList.remove('active', 'text-yupRed');
                t.classList.add('text-gray-400');
                const dot = t.querySelector('.faq-dot');
                if (dot) {
                    dot.classList.remove('bg-yupRed');
                    dot.classList.add('bg-transparent');
                }
            });

            tab.classList.add('active', 'text-yupRed');
            tab.classList.remove('text-gray-400');
            const activeDot = tab.querySelector('.faq-dot');
            if (activeDot) {
                activeDot.classList.add('bg-yupRed');
                activeDot.classList.remove('bg-transparent');
            }

            // Filter FAQ Rows
            faqRows.forEach(row => {
                const rowCats = (row.getAttribute('data-faq-cat') || '').split(' ');
                const isExtra = row.classList.contains('faq-extra');
                const isExtraVisible = !row.classList.contains('hidden');

                if (category === 'all' || rowCats.includes(category)) {
                    // If it's an extra row that wasn't expanded yet, keep it hidden unless filtered
                    if (isExtra && !isExtraVisible && category === 'all') {
                        row.style.display = 'none';
                    } else {
                        row.style.display = '';
                    }
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // 7.3 FAQ Accordion Toggle
    faqRows.forEach(row => {
        const btn = row.querySelector('.faq-row-btn');
        const content = row.querySelector('.faq-row-content');
        const arrow = row.querySelector('.faq-row-arrow');

        if (btn && content) {
            btn.addEventListener('click', () => {
                const isCurrentlyOpen = !content.classList.contains('hidden');

                // Close all other rows
                faqRows.forEach(otherRow => {
                    const otherContent = otherRow.querySelector('.faq-row-content');
                    const otherArrow = otherRow.querySelector('.faq-row-arrow');
                    if (otherContent && otherRow !== row) {
                        otherContent.classList.add('hidden');
                    }
                    if (otherArrow && otherRow !== row) {
                        otherArrow.classList.remove('rotate-180');
                    }
                });

                // Toggle this row
                if (isCurrentlyOpen) {
                    content.classList.add('hidden');
                    if (arrow) arrow.classList.remove('rotate-180');
                } else {
                    content.classList.remove('hidden');
                    if (arrow) arrow.classList.add('rotate-180');
                    {
                        gsap.from(content, { opacity: 0, y: -6, duration: 0.25, ease: 'power2.out' });
                    }
                }
            });
        }
    });

    // 7.4 FAQ "더보기" Button
    const faqMoreBtn = document.getElementById('faqMoreBtn');
    if (faqMoreBtn) {
        let isExpanded = false;
        faqMoreBtn.addEventListener('click', () => {
            const extraRows = document.querySelectorAll('.faq-extra');
            isExpanded = !isExpanded;

            extraRows.forEach(row => {
                if (isExpanded) {
                    row.classList.remove('hidden');
                    row.style.display = '';
                    {
                        gsap.from(row, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' });
                    }
                } else {
                    row.classList.add('hidden');
                    row.style.display = 'none';
                }
            });

            faqMoreBtn.textContent = isExpanded ? '접기' : '더보기';
        });
    }

    // 7.5 Store Search Functionality
    const storeSearchBtn = document.getElementById('storeSearchBtn');
    const storeSearchInput = document.getElementById('storeSearchInput');
    const storeCards = document.querySelectorAll('.store-card');

    function filterStores() {
        if (!storeSearchInput) return;
        const query = storeSearchInput.value.trim().toLowerCase();
        storeCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (!query || text.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (storeSearchBtn && storeSearchInput) {
        storeSearchBtn.addEventListener('click', filterStores);
        storeSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterStores();
        });
    }

    // 7.6 VOC Form Submission
    const vocForm = document.getElementById('vocForm');
    if (vocForm) {
        vocForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('고객님의 소중한 의견이 정상적으로 접수되었습니다.\n담당 부서에서 확인 후 신속히 답변 드리겠습니다. 감사합니다!');
            vocForm.reset();
        });
    }

    /* ========================================================
       8. SCROLL TO TOP BUTTON (WITH LENIS SMOOTH SCROLL)
       ======================================================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
                scrollTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            } else {
                scrollTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
                scrollTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            setActiveGnbLink(null);
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Smooth Anchor Scroll with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            const targetEl = document.querySelector(href);
            if (targetEl) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(targetEl, { offset: -90, duration: 1.2 });
                } else {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    /* ========================================================
       9. GSAP SCROLLTRIGGER ANIMATIONS
       ======================================================== */
             {
        
        // 9.1 Hero Section Elements
        if (document.querySelector('.heroSwiper')) {
            gsap.from('.heroSwiper', {
                opacity: 0,
                scale: 0.98,
                duration: 1,
                ease: 'power3.out',
                delay: 0.1
            });
        }

        // 9.2 Möbius Loop Infographic Section
        gsap.from('.loop-section-anim', {
            scrollTrigger: {
                trigger: '.loop-section-anim',
                start: 'top 80%',
            },
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: 'power2.out'
        });

        // 9.3 3 Value Stories (마우스를 천천히 내릴 때 하나씩 스르륵 나타나는 애니메이션)
        const storyRows = document.querySelectorAll('.value-story-row');
        storyRows.forEach((row) => {
            gsap.from(row, {
                scrollTrigger: {
                    trigger: row,
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 1.2,
                ease: 'power3.out'
            });
        });

        // 9.4 Menu Section Title & Swiper
        gsap.from('#menu h3', {
            scrollTrigger: {
                trigger: '#menu',
                start: 'top 80%',
            },
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: 'power2.out'
        });

        // 9.5 Event Section Title & Cards
        gsap.from('#event h3', {
            scrollTrigger: {
                trigger: '#event',
                start: 'top 80%',
            },
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: 'power2.out'
        });

        // 9.6 Customer FAQ Section
        gsap.from('#customer .faq-row', {
            scrollTrigger: {
                trigger: '#customer',
                start: 'top 75%',
            },
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out'
        });
    }

});
